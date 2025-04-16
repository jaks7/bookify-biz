
import React from "react";
import { BusinessDetails } from "@/components/business/BusinessDetails";
import { BusinessDetail } from "@/types/booking";

const mockBusinessData: BusinessDetail = {
  name: "Fisioterapia Cervical",
  description: "Centro especializado en tratamientos de fisioterapia cervical y problemas posturales.",
  address: "C Cristobal Colon 5, Castellon, 12002",
  phone: "964 123 456",
  business_hours: {
    "1": [
      {
        start: "09:00",
        end: "17:00"
      }
    ],
    "2": [
      {
        start: "09:00",
        end: "17:00"
      }
    ],
    "3": [
      {
        start: "09:00",
        end: "17:00"
      }
    ],
    "4": [
      {
        start: "09:00",
        end: "17:00"
      }
    ],
    "5": [
      {
        start: "09:00",
        end: "17:00"
      }
    ],
    "6": [
      {
        start: "09:00",
        end: "14:00"
      }
    ],
    "7": []
  },
  services: [
    {
      name: "Consulta general",
      duration: 30,
      price: 15.0
    },
    {
      name: "Alineado cervical",
      duration: 60,
      price: 100.0
    }
  ]
};

const DemoBusinessDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        <BusinessDetails business={mockBusinessData} reservationPath="/demo/reservation" />
      </div>
    </div>
  );
};

export default DemoBusinessDetails;
