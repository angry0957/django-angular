# api/serializers.py
from rest_framework import serializers
from .models import Lawyer


class LawyerSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'user',
        )
        model = Lawyer