// Define all your navigation types here
export type RootStackParamList = {
    Start: undefined;
    Home: undefined;
    Questionnaire: undefined;
    Itinerary: { 
      destination: string;
      budget: string;
      duration: string;
    };
    Booking: { 
      accommodationId: string;
      checkIn: string;
      checkOut: string;
    };
    Settings: undefined;
  };