import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking, BookingFormData, BookingType } from '@/types/booking';
import { Professional } from '@/types/professional';
import { Service } from '@/types/service';
import { TimePicker } from './TimePicker';
import { format, parseISO, add } from 'date-fns';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => void;
  booking?: Booking;
  date: string;
  professionals: Professional[];
  services: Service[];
  defaultProfessionalId?: number;
  isEditing: boolean;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  booking,
  date,
  professionals,
  services,
  defaultProfessionalId,
  isEditing
}) => {
  const [bookingType, setBookingType] = useState<BookingType>(
    booking?.title ? 'block' : 'reservation'
  );
  const [title, setTitle] = useState(booking?.title || '');
  const [professionalId, setProfessionalId] = useState<number | undefined>(
    booking?.professional?.professional_id || defaultProfessionalId
  );
  const [serviceId, setServiceId] = useState<number | undefined>(
    booking?.service?.service_id
  );
  const [clientName, setClientName] = useState(booking?.client?.fullname || '');
  const [clientPhone, setClientPhone] = useState(booking?.client?.phone || '');
  const [startTime, setStartTime] = useState(
    booking
      ? format(parseISO(booking.start_datetime), 'HH:mm')
      : format(new Date(), 'HH:mm')
  );
  const [endTime, setEndTime] = useState(
    booking
      ? format(parseISO(booking.end_datetime), 'HH:mm')
      : format(add(new Date(), { minutes: 30 }), 'HH:mm')
  );

  useEffect(() => {
    if (booking) {
      setBookingType(booking.title ? 'block' : 'reservation');
      setTitle(booking.title || '');
      setProfessionalId(booking.professional?.professional_id);
      setServiceId(booking.service?.service_id);
      setClientName(booking.client?.fullname || '');
      setClientPhone(booking.client?.phone || '');
      setStartTime(format(parseISO(booking.start_datetime), 'HH:mm'));
      setEndTime(format(parseISO(booking.end_datetime), 'HH:mm'));
    } else {
      // Reset form for new booking
      setBookingType('reservation');
      setTitle('');
      setProfessionalId(defaultProfessionalId);
      setServiceId(undefined);
      setClientName('');
      setClientPhone('');
      // Keep the times as they might be set based on where the user clicked
    }
  }, [booking, defaultProfessionalId]);

  const handleSave = () => {
    // Format datetime strings for API
    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const formData: BookingFormData = {
      booking_type: bookingType,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      professional_id: professionalId,
    };

    if (bookingType === 'block') {
      formData.title = title;
    } else {
      formData.service_id = serviceId;
      // Note: In a real app, you might need to handle client creation/lookup
      // For now, we're just passing the data without client_id
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Crear'} {bookingType === 'block' ? 'bloqueo' : 'reserva'}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={bookingType} onValueChange={(value) => setBookingType(value as BookingType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservation">Reserva</TabsTrigger>
            <TabsTrigger value="block">Bloqueo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservation" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="professional">Profesional</Label>
              <Select 
                value={professionalId?.toString()} 
                onValueChange={(value) => setProfessionalId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Servicio</Label>
              <Select 
                value={serviceId?.toString()} 
                onValueChange={(value) => setServiceId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente</Label>
              <Input 
                id="clientName" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
                placeholder="Nombre del cliente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input 
                id="clientPhone" 
                value={clientPhone} 
                onChange={(e) => setClientPhone(e.target.value)} 
                placeholder="Teléfono del cliente"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="block" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del bloqueo</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Ej: Reunión, Descanso, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="professional">Profesional</Label>
              <Select 
                value={professionalId?.toString()} 
                onValueChange={(value) => setProfessionalId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hora inicio</Label>
            <TimePicker value={startTime} onChange={setStartTime} />
          </div>
          
          <div className="space-y-2">
            <Label>Hora fin</Label>
            <TimePicker value={endTime} onChange={setEndTime} />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
