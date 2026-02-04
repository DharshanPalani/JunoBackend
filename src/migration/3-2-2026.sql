CREATE TABLE IF NOT EXISTS participants_payment (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('NO_PAYMENT', 'PAYMENT_DONE', 'VERIFIED_PAYMENT')),
    payment_screenshot TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP
);


CREATE UNIQUE INDEX unique_registration_payment
ON participants_payment (registration_id);
