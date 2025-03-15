
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Briefcase, Users, MapPin, Building, CalendarClock, ClockOff, Clock4 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

// Define the schema for the form
const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().min(5, { message: 'El código postal debe tener 5 dígitos' }),
  cif: z.string().optional(),
  type_of_business: z.string().min(1, { message: 'Selecciona un tipo de negocio' }),
  professionals: z.string().min(1, { message: 'Indica cuántos profesionales trabajan en el negocio' }),
  schedule: z.record(z.object({
    open: z.boolean(),
    continuous: z.boolean(),
    morning: z.object({
      from: z.string(),
      to: z.string(),
    }),
    afternoon: z.object({
      from: z.string(),
      to: z.string(),
    }),
  })),
});

type ScheduleDay = {
  open: boolean;
  continuous: boolean;
  morning: {
    from: string;
    to: string;
  };
  afternoon: {
    from: string;
    to: string;
  };
};

type BusinessFormValues = z.infer<typeof formSchema>;

const businessTypes = [
  { value: 'barberia', label: 'Barbería' },
  { value: 'peluqueria', label: 'Peluquería' },
  { value: 'psicologia', label: 'Psicología' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'masajes', label: 'Masajes' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'estetica', label: 'Estética' },
  { value: 'dermatologia', label: 'Dermatología' },
  { value: 'medicina', label: 'Medicina' },
  { value: 'odontologia', label: 'Odontología' },
  { value: 'otros', label: 'Otros' },
];

const professionalOptions = [
  { value: '1', label: 'Solo yo', description: 'Eres el único profesional con agenda' },
  { value: '2-5', label: 'Entre 2 y 5', description: 'Equipo pequeño de profesionales' },
  { value: '6-10', label: 'Entre 6 y 10', description: 'Equipo mediano de profesionales' },
  { value: '10+', label: 'Más de 10', description: 'Equipo grande de profesionales' },
];

const weekDays = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
];

const defaultSchedule = {
  open: true,
  continuous: false,
  morning: {
    from: '09:00',
    to: '14:00',
  },
  afternoon: {
    from: '16:00',
    to: '20:00',
  },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: BusinessFormValues = {
    name: '',
    address: '',
    city: '',
    postal_code: '',
    cif: '',
    type_of_business: '',
    professionals: '',
    schedule: {
      monday: { ...defaultSchedule },
      tuesday: { ...defaultSchedule },
      wednesday: { ...defaultSchedule },
      thursday: { ...defaultSchedule },
      friday: { ...defaultSchedule },
      saturday: { ...defaultSchedule, afternoon: { from: '16:00', to: '19:00' } },
      sunday: { ...defaultSchedule, open: false },
    },
  };

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: BusinessFormValues) => {
    setIsSubmitting(true);
    try {
      // Filter only fields needed for the backend
      const businessData = {
        name: data.name,
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code,
        cif: data.cif || '',
        type_of_business: data.type_of_business,
      };

      console.log('Submitting business data:', businessData);
      // Here we would make the API call to create the business
      // For now we're just simulating a successful API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Negocio creado correctamente');
      navigate('/agenda'); // Redirect to agenda after success
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Ha ocurrido un error al crear el negocio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const { name, postal_code, type_of_business } = form.getValues();
      if (!name || !postal_code || !type_of_business) {
        form.trigger(['name', 'postal_code', 'type_of_business']);
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const toggleDayOpen = (day: string) => {
    const currentValue = form.getValues().schedule[day].open;
    form.setValue(`schedule.${day}.open`, !currentValue);
  };

  const toggleContinuousSchedule = (day: string) => {
    const currentValue = form.getValues().schedule[day].continuous;
    form.setValue(`schedule.${day}.continuous`, !currentValue);
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Configura tu negocio</h1>
        <p className="text-muted-foreground">Completa la información para empezar a usar la plataforma</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex items-center">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información Básica
                </CardTitle>
                <CardDescription>
                  Cuéntanos sobre tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del negocio *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de tu negocio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type_of_business"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de negocio *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de negocio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Ciudad (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal *</FormLabel>
                        <FormControl>
                          <Input placeholder="Código postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIF/NIF</FormLabel>
                        <FormControl>
                          <Input placeholder="CIF/NIF (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Siguiente
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal
                </CardTitle>
                <CardDescription>
                  Cuéntanos cuántos profesionales necesitan gestionar sus agendas en el negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="professionals"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Nº de profesionales con agenda</FormLabel>
                      <FormDescription>
                        Indica cuántos profesionales necesitan gestionar citas con clientes 
                        (no incluyas personal administrativo o sin agenda de citas)
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {professionalOptions.map((option) => (
                            <FormItem key={option.value} className="relative flex space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-accent">
                              <FormControl>
                                <RadioGroupItem value={option.value} className="absolute left-4 top-4" />
                              </FormControl>
                              <div className="pl-5">
                                <FormLabel className="text-base font-medium cursor-pointer">
                                  {option.label}
                                </FormLabel>
                                <FormDescription>
                                  {option.description}
                                </FormDescription>
                              </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={prevStep}>
                  Anterior
                </Button>
                <Button type="button" onClick={nextStep}>
                  Siguiente
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Horario
                </CardTitle>
                <CardDescription>
                  Establece el horario de apertura de tu negocio. Podrás modificarlo más adelante.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {weekDays.map((day) => {
                  const dayPath = `schedule.${day.id}` as const;
                  return (
                    <div key={day.id} className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name={`${dayPath}.open` as const}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={() => toggleDayOpen(day.id)}
                                  />
                                </FormControl>
                                <FormLabel className="font-medium text-base">
                                  {day.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`${dayPath}.open` as const}
                          render={({ field }) => (
                            <div className="flex items-center gap-2 text-sm">
                              {field.value ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <Clock className="h-4 w-4" />
                                  Abierto
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <ClockOff className="h-4 w-4" />
                                  Cerrado
                                </span>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`${dayPath}.open` as const}
                        render={({ field }) => (
                          <>
                            {field.value && (
                              <div className="pl-10 space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`${dayPath}.continuous` as const}
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={() => toggleContinuousSchedule(day.id)}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        Horario continuo (sin cierre al mediodía)
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />

                                {form.getValues().schedule[day.id].continuous ? (
                                  <div className="space-y-2">
                                    <FormLabel className="text-sm flex items-center gap-1">
                                      <Clock4 className="h-4 w-4" />
                                      Horario continuo
                                    </FormLabel>
                                    <div className="flex items-center space-x-2">
                                      <FormField
                                        control={form.control}
                                        name={`${dayPath}.morning.from` as const}
                                        render={({ field }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input type="time" {...field} />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                      <span>a</span>
                                      <FormField
                                        control={form.control}
                                        name={`${dayPath}.afternoon.to` as const}
                                        render={({ field }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input type="time" {...field} />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <FormLabel className="text-sm">Mañana</FormLabel>
                                      <div className="flex items-center space-x-2">
                                        <FormField
                                          control={form.control}
                                          name={`${dayPath}.morning.from` as const}
                                          render={({ field }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input type="time" {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                        <span>a</span>
                                        <FormField
                                          control={form.control}
                                          name={`${dayPath}.morning.to` as const}
                                          render={({ field }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input type="time" {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <FormLabel className="text-sm">Tarde</FormLabel>
                                      <div className="flex items-center space-x-2">
                                        <FormField
                                          control={form.control}
                                          name={`${dayPath}.afternoon.from` as const}
                                          render={({ field }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input type="time" {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                        <span>a</span>
                                        <FormField
                                          control={form.control}
                                          name={`${dayPath}.afternoon.to` as const}
                                          render={({ field }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input type="time" {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Separator className="mt-4" />
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={prevStep}>
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Finalizar"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Onboarding;
