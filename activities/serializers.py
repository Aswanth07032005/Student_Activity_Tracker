from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = '__all__'

    def validate_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Hours must be greater than zero"
            )
        return value