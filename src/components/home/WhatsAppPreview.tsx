
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const WhatsAppPreview = () => {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg max-w-md mx-auto border border-gray-200">
      {/* WhatsApp header */}
      <div className="bg-green-600 text-white p-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
        <div>
          <div className="font-semibold">HoraLibre Asistente</div>
          <div className="text-xs text-green-100">Online</div>
        </div>
      </div>
      
      {/* Chat content */}
      <div className="bg-[#e5e5f7] p-3 h-[350px] overflow-y-auto flex flex-col">
        <div className="flex justify-start mb-3">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">¡Hola! Soy el asistente virtual de Centro de Fisioterapia Bienestar. ¿En qué puedo ayudarte hoy?</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:05</div>
          </div>
        </div>
        
        <div className="flex justify-end mb-3">
          <div className="bg-green-100 rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Hola, quiero una cita para fisioterapia</p>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              10:06
              <CheckCheck className="h-3 w-3 ml-1 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mb-3">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">¡Claro! Estaré encantado de ayudarte con eso. ¿Para qué tipo de sesión de fisioterapia te gustaría reservar?</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:06</div>
          </div>
        </div>
        
        <div className="flex justify-end mb-3">
          <div className="bg-green-100 rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Sesión de fisioterapia general</p>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              10:07
              <CheckCheck className="h-3 w-3 ml-1 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mb-3">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Perfecto. ¿Tienes alguna preferencia de día y hora para tu sesión?</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:07</div>
          </div>
        </div>
        
        <div className="flex justify-end mb-3">
          <div className="bg-green-100 rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Me gustaría un martes o jueves a partir de las 18:00</p>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              10:08
              <CheckCheck className="h-3 w-3 ml-1 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mb-3">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">He verificado nuestra disponibilidad y tenemos los siguientes horarios para sesiones de fisioterapia general:</p>
            <p className="text-gray-800 mt-2">- Martes 15/10 a las 18:30</p>
            <p className="text-gray-800">- Jueves 17/10 a las 19:00</p>
            <p className="text-gray-800 mt-2">¿Cuál de estas opciones prefieres?</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:09</div>
          </div>
        </div>
        
        <div className="flex justify-end mb-3">
          <div className="bg-green-100 rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">El martes a las 18:30 me viene bien</p>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              10:10
              <CheckCheck className="h-3 w-3 ml-1 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mb-3">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Excelente. Para confirmar tu cita:</p>
            <p className="text-gray-800 font-medium mt-2">Sesión de fisioterapia general</p>
            <p className="text-gray-800">Martes 15/10/2024 a las 18:30</p>
            <p className="text-gray-800">Duración: 45 minutos</p>
            <p className="text-gray-800 mt-2">¿Confirmas esta reserva?</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:10</div>
          </div>
        </div>
        
        <div className="flex justify-end mb-3">
          <div className="bg-green-100 rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">Sí, confirmo</p>
            <div className="flex justify-end items-center text-xs text-gray-500 mt-1">
              10:11
              <CheckCheck className="h-3 w-3 ml-1 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-gray-800">¡Tu cita ha sido confirmada! Te esperamos el martes 15/10 a las 18:30 para tu sesión de fisioterapia general.</p>
            <p className="text-gray-800 mt-2">Te enviaremos un recordatorio 24 horas antes de tu cita.</p>
            <p className="text-gray-800 mt-2">Si necesitas modificar o cancelar tu reserva, házmelo saber con al menos 4 horas de anticipación.</p>
            <p className="text-gray-800 mt-2">¡Que tengas un buen día!</p>
            <div className="text-xs text-gray-500 text-right mt-1">10:11</div>
          </div>
        </div>
      </div>
      
      {/* Message input (static) */}
      <div className="bg-white p-3 flex items-center border-t border-gray-200">
        <div className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-gray-400">
          Escribe un mensaje...
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
