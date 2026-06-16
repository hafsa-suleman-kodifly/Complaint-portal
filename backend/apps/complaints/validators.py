import os
from rest_framework import serializers

ALLOWED_EXTS = {".png", ".jpg", ".jpeg", ".pdf"}
MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_FILES = 3

def validate_attachments(files):
    if len(files) > MAX_FILES:
        raise serializers.ValidationError("Maximum 3 files allowed.")
    for f in files:
        ext = os.path.splitext(f.name.lower())[1]
        if ext not in ALLOWED_EXTS:
            raise serializers.ValidationError(f"{f.name}: invalid file type.")
        if f.size > MAX_FILE_SIZE:
            raise serializers.ValidationError(f"{f.name}: max size is 5MB.")