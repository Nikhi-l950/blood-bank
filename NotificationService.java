package com.bloodcare.service;

import com.bloodcare.model.Donor;
import org.springframework.lang.NonNull;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationConfirmation(@NonNull Donor donor) {
        try {
            if (donor.getEmail() == null || donor.getEmail().isBlank()) return;
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(donor.getEmail());
            msg.setSubject("BloodCare: Donor Registration Confirmation");
            msg.setText("Dear " + donor.getFirstName() + ",\n\n" +
                    "Thank you for registering as a blood donor with BloodCare. " +
                    "We appreciate your willingness to save lives.\n\n" +
                    "Blood Type: " + donor.getBloodType() + "\n" +
                    (donor.getCity() != null ? ("Location: " + donor.getCity() + "\n") : "") +
                    "We will notify you ahead of upcoming donation camps.\n\n" +
                    "Regards,\nBloodCare Team");
            mailSender.send(msg);
        } catch (MailException ex) {
            // Mail is optional; ignore failures in this basic setup
        }
    }
} 