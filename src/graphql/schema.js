export const typeDefs = `
  type Query {
    getAppointments: [Appointment]
    getBarbers: [Barber]
    getBusinessHours: [BusinessHours]
  }

  type Mutation {
    createAppointment(input: CreateAppointmentInput!): CreateAppointmentResponse!
    rescheduleAppointment(input: RescheduleAppointmentInput!): Appointment
    deleteAppointment(appointmentId: ID!): Appointment
    runAgent(newMessage: String!): String!
  }

  type Appointment {
    id: ID
    name: String
    barber: String
    date: String
    phone: Int
    message: String
  }

  type Barber {
    id: ID!
    name: String!
    color: String
  }

  type BusinessHours {
    id: ID!
    day: String!
    hours: [String!]!
  }

  input CreateAppointmentInput {
    name: String!
    barber: String!
    date: String!
    phone: String!
    message: String
  }

  input RescheduleAppointmentInput {
    appointmentId: ID!
    newDate: String!
    barber: String
  }

  type CreateAppointmentResponse {
    success: Boolean!
    message: String!
  }
`;
