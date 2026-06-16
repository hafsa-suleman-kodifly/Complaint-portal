from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

LOCK_MINUTES = 15
MAX_FAILURES = 5

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_staff"]

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email=email).first()
        now = timezone.now()

        if user and user.locked_until and user.locked_until > now:
            raise serializers.ValidationError({
                "detail": "Account locked. Try again later."
            })

        auth_user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password,
        )

        if not auth_user:
            if user:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= MAX_FAILURES:
                    user.locked_until = now + timedelta(minutes=LOCK_MINUTES)
                user.save(update_fields=["failed_login_attempts", "locked_until"])
            raise serializers.ValidationError({
                "detail": "Invalid credentials."
            })

        auth_user.failed_login_attempts = 0
        auth_user.locked_until = None
        auth_user.save(update_fields=["failed_login_attempts", "locked_until"])

        refresh = self.get_token(auth_user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(auth_user).data,
        }