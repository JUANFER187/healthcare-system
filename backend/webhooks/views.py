from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from appointments.models import Appointment

@csrf_exempt
@require_http_methods(["POST"])
def appointment_webhook(request):
    try:
        data = json.loads(request.body)
        appointment_id = data.get('appointment_id')
        event_type = data.get('event_type')  # created, confirmed, cancelled
        
        if not appointment_id or not event_type:
            return JsonResponse({'error': 'Datos incompletos'}, status=400)
        
        try:
            appointment = Appointment.objects.select_related('patient', 'professional', 'service').get(id=appointment_id)
        except Appointment.DoesNotExist:
            return JsonResponse({'error': 'Cita no encontrada'}, status=404)
        
        # Datos para n8n
        webhook_data = {
            'event_type': event_type,
            'appointment': {
                'id': appointment.id,
                'date': str(appointment.appointment_date),
                'time': str(appointment.appointment_time),
                'status': appointment.status,
                'patient': {
                    'id': appointment.patient.id,
                    'name': appointment.patient.get_full_name(),
                    'phone': appointment.patient.phone,  # Asegúrate de que este campo exista
                    'email': appointment.patient.email
                },
                'professional': {
                    'name': appointment.professional.get_full_name(),
                    'specialty': appointment.professional.specialty
                },
                'service': {
                    'name': appointment.service.name,
                    'duration': appointment.service.duration
                }
            }
        }
        
        return JsonResponse(webhook_data)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)