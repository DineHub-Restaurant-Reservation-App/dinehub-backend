package com.dinehub.dinehubbackend.services;

import com.dinehub.dinehubbackend.entities.ReservationSettings;

public interface ReservationSettingsService {

    public ReservationSettings createReservationSetting(ReservationSettings reservationSettings);

    public ReservationSettings updateReservationSetting(ReservationSettings reservationSettings);

    public boolean deleteReservationSetting(ReservationSettings reservationSettings);
}
