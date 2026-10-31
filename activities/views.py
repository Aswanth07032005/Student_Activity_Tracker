from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .models import Activity
from .serializers import ActivitySerializer


@api_view(['GET', 'POST'])
def activities_list(request):

    if request.method == 'GET':
        activities = Activity.objects.all().order_by('-created_at')
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    serializer = ActivitySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def summary(request):

    total_entries = Activity.objects.count()

    total_hours = Activity.objects.aggregate(
        total=Sum('hours')
    )['total'] or 0

    most_active = (
        Activity.objects.values('name')
        .annotate(total=Sum('hours'))
        .order_by('-total', 'name')
        .first()
    )

    return Response({
        'total_entries': total_entries,
        'total_hours': total_hours,
        'most_active_user': most_active['name'] if most_active else None
    })








@api_view(['DELETE'])
def delete_activity(request, id):

    try:
        activity = Activity.objects.get(id=id)
        activity.delete()

        return Response(
            {"message": "Activity deleted successfully"},
            status=status.HTTP_200_OK
        )

    except Activity.DoesNotExist:
        return Response(
            {"error": "Activity not found"},
            status=status.HTTP_404_NOT_FOUND
        )