
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Search, MessageSquare, Calendar, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Mock data
const conversations = [
  {
    id: '1',
    customer: {
      name: 'María García',
      phone: '+34612345678',
      avatar: 'MG',
    },
    lastMessage: {
      text: 'Sí, confirmo',
      timestamp: new Date('2024-10-01T10:11:00'),
      status: 'read',
    },
    status: 'confirmed',
    unread: false,
    appointment: {
      service: 'Fisioterapia General',
      date: new Date('2024-10-15T18:30:00'),
      duration: 45,
    }
  },
  {
    id: '2',
    customer: {
      name: 'Carlos Rodríguez',
      phone: '+34623456789',
      avatar: 'CR',
    },
    lastMessage: {
      text: 'Gracias, ¿pueden enviarme un recordatorio?',
      timestamp: new Date('2024-10-01T09:45:00'),
      status: 'read',
    },
    status: 'pending',
    unread: true,
    appointment: null,
  },
  {
    id: '3',
    customer: {
      name: 'Ana Martínez',
      phone: '+34634567890',
      avatar: 'AM',
    },
    lastMessage: {
      text: 'Necesito cambiar mi cita del viernes',
      timestamp: new Date('2024-09-30T18:23:00'),
      status: 'read',
    },
    status: 'rescheduling',
    unread: true,
    appointment: {
      service: 'Masaje Terapéutico',
      date: new Date('2024-10-04T16:00:00'),
      duration: 60,
    }
  },
  {
    id: '4',
    customer: {
      name: 'Laura Sánchez',
      phone: '+34645678901',
      avatar: 'LS',
    },
    lastMessage: {
      text: 'Perfecto, nos vemos mañana entonces',
      timestamp: new Date('2024-09-29T12:10:00'),
      status: 'read',
    },
    status: 'confirmed',
    unread: false,
    appointment: {
      service: 'Valoración Inicial',
      date: new Date('2024-09-30T11:00:00'),
      duration: 60,
    }
  },
  {
    id: '5',
    customer: {
      name: 'José Fernández',
      phone: '+34656789012',
      avatar: 'JF',
    },
    lastMessage: {
      text: 'Prefiero el horario de las 17:00',
      timestamp: new Date('2024-09-28T15:47:00'),
      status: 'read',
    },
    status: 'pending',
    unread: false,
    appointment: null,
  },
];

const messages = [
  {
    id: '1',
    senderId: 'system',
    text: '¡Hola! Soy el asistente virtual de Centro de Fisioterapia Bienestar. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date('2024-10-01T10:05:00'),
  },
  {
    id: '2',
    senderId: 'customer',
    text: 'Hola, quiero una cita para fisioterapia',
    timestamp: new Date('2024-10-01T10:06:00'),
  },
  {
    id: '3',
    senderId: 'system',
    text: '¡Claro! Estaré encantado de ayudarte con eso. ¿Para qué tipo de sesión de fisioterapia te gustaría reservar?',
    timestamp: new Date('2024-10-01T10:06:30'),
  },
  {
    id: '4',
    senderId: 'customer',
    text: 'Sesión de fisioterapia general',
    timestamp: new Date('2024-10-01T10:07:00'),
  },
  {
    id: '5',
    senderId: 'system',
    text: 'Perfecto. ¿Tienes alguna preferencia de día y hora para tu sesión?',
    timestamp: new Date('2024-10-01T10:07:30'),
  },
  {
    id: '6',
    senderId: 'customer',
    text: 'Me gustaría un martes o jueves a partir de las 18:00',
    timestamp: new Date('2024-10-01T10:08:00'),
  },
  {
    id: '7',
    senderId: 'system',
    text: 'He verificado nuestra disponibilidad y tenemos los siguientes horarios para sesiones de fisioterapia general:\n\n- Martes 15/10 a las 18:30\n- Jueves 17/10 a las 19:00\n\n¿Cuál de estas opciones prefieres?',
    timestamp: new Date('2024-10-01T10:09:00'),
  },
  {
    id: '8',
    senderId: 'customer',
    text: 'El martes a las 18:30 me viene bien',
    timestamp: new Date('2024-10-01T10:10:00'),
  },
  {
    id: '9',
    senderId: 'system',
    text: 'Excelente. Para confirmar tu cita:\n\nSesión de fisioterapia general\nMartes 15/10/2024 a las 18:30\nDuración: 45 minutos\n\n¿Confirmas esta reserva?',
    timestamp: new Date('2024-10-01T10:10:30'),
  },
  {
    id: '10',
    senderId: 'customer',
    text: 'Sí, confirmo',
    timestamp: new Date('2024-10-01T10:11:00'),
  },
  {
    id: '11',
    senderId: 'system',
    text: '¡Tu cita ha sido confirmada! Te esperamos el martes 15/10 a las 18:30 para tu sesión de fisioterapia general.\n\nTe enviaremos un recordatorio 24 horas antes de tu cita.\n\nSi necesitas modificar o cancelar tu reserva, házmelo saber con al menos 4 horas de anticipación.\n\n¡Que tengas un buen día!',
    timestamp: new Date('2024-10-01T10:11:30'),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-amber-500';
    case 'rescheduling':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Pendiente</Badge>;
    case 'rescheduling':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Cambiando</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelada</Badge>;
    default:
      return <Badge className="bg-gray-500">Desconocido</Badge>;
  }
};

const WhatsApp = () => {
  const [selectedChat, setSelectedChat] = useState(conversations[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conversation => {
    const matchesStatus = filterStatus === 'all' || conversation.status === filterStatus;
    const matchesSearch = conversation.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conversation.customer.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });
  
  const currentChat = conversations.find(conv => conv.id === selectedChat);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // In a real app, you would send the message to your backend
    console.log('Sending message:', messageInput);
    
    // Clear input
    setMessageInput('');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">WhatsApp</h1>
            <Link to="/agenda">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </Button>
            </Link>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar conversación..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="rescheduling">Cambiando</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={cn(
                "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition",
                conversation.id === selectedChat ? "bg-gray-50" : ""
              )}
              onClick={() => setSelectedChat(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white",
                    "bg-bookify-500"
                  )}>
                    {conversation.customer.avatar}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium mr-2">{conversation.customer.name}</h3>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        conversation.unread ? "bg-bookify-500" : "hidden"
                      )}></div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{conversation.lastMessage.text}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 mb-1">
                    {format(conversation.lastMessage.timestamp, 'HH:mm')}
                  </span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(conversation.status)
                  )}></div>
                </div>
              </div>
              
              {conversation.appointment && (
                <div className="mt-2 bg-gray-100 rounded-md p-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{conversation.appointment.service}</span>
                    {getStatusBadge(conversation.status)}
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {format(conversation.appointment.date, 'dd/MM/yyyy')} a las {format(conversation.appointment.date, 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="hidden md:flex flex-col flex-1 h-full">
        {currentChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-bookify-500 flex items-center justify-center text-white mr-3">
                  {currentChat.customer.avatar}
                </div>
                <div>
                  <h2 className="font-medium">{currentChat.customer.name}</h2>
                  <p className="text-sm text-gray-500">{currentChat.customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {currentChat.appointment && (
                  <Card className="border shadow-sm">
                    <CardContent className="p-3 flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium">{currentChat.appointment.service}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {format(currentChat.appointment.date, 'dd/MM/yyyy')}
                          </span>
                          <Clock className="h-3 w-3 mx-1" />
                          <span>
                            {format(currentChat.appointment.date, 'HH:mm')}
                          </span>
                        </div>
                      </div>
                      {currentChat.status === 'confirmed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-amber-500" />
                      )}
                    </CardContent>
                  </Card>
                )}
                
                <Tabs defaultValue="chat">
                  <TabsList className="grid w-32 grid-cols-2">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5e5f7]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-4 max-w-[80%]",
                    message.senderId === "system" 
                      ? "mr-auto" 
                      : "ml-auto"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3 shadow-sm",
                      message.senderId === "system" 
                        ? "bg-white" 
                        : "bg-green-100"
                    )}
                  >
                    <p className="text-gray-800 whitespace-pre-line">{message.text}</p>
                    <div className={cn(
                      "text-xs text-gray-500 mt-1",
                      message.senderId === "system" 
                        ? "text-right" 
                        : "flex justify-end items-center"
                    )}>
                      {format(message.timestamp, 'HH:mm')}
                      {message.senderId === "customer" && (
                        <div className="flex ml-1">
                          <CheckCheck className="h-3 w-3 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-bookify-500 hover:bg-bookify-600">
                  Enviar
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No hay chat seleccionado</h2>
              <p className="text-gray-500">Selecciona una conversación para ver los mensajes</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile view - only show when a chat is selected */}
      <div className="md:hidden flex flex-col flex-1 h-full">
        {currentChat ? (
          <>
            {/* Chat header with back button */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 p-1"
                onClick={() => setSelectedChat('')}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-bookify-500 flex items-center justify-center text-white mr-3">
                  {currentChat.customer.avatar}
                </div>
                <div>
                  <h2 className="font-medium">{currentChat.customer.name}</h2>
                  <p className="text-sm text-gray-500">{currentChat.customer.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Appointment info */}
            {currentChat.appointment && (
              <div className="p-3 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{currentChat.appointment.service}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(currentChat.appointment.date, 'dd/MM/yyyy')}
                      </span>
                      <Clock className="h-3 w-3 mx-1" />
                      <span>
                        {format(currentChat.appointment.date, 'HH:mm')}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(currentChat.status)}
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5e5f7]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-4 max-w-[80%]",
                    message.senderId === "system" 
                      ? "mr-auto" 
                      : "ml-auto"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3 shadow-sm",
                      message.senderId === "system" 
                        ? "bg-white" 
                        : "bg-green-100"
                    )}
                  >
                    <p className="text-gray-800 whitespace-pre-line">{message.text}</p>
                    <div className={cn(
                      "text-xs text-gray-500 mt-1",
                      message.senderId === "system" 
                        ? "text-right" 
                        : "flex justify-end items-center"
                    )}>
                      {format(message.timestamp, 'HH:mm')}
                      {message.senderId === "customer" && (
                        <div className="flex ml-1">
                          <CheckCheck className="h-3 w-3 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-bookify-500 hover:bg-bookify-600">
                  Enviar
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No hay chat seleccionado</h2>
              <p className="text-gray-500">Selecciona una conversación para ver los mensajes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsApp;
