import React, { useState, createContext, useContext } from 'react';
type UserRole = 'passenger' | 'driver' | null;
interface Driver {
  busNumber: string;
  name: string;
}

