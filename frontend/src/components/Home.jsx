import React, { useState } from 'react';
import BookingModal from './BookingModal';

const SPORTS = [
  { name: 'Tennis',       image: '/tennis.jpg',    label: 'Book Court' },
  { name: 'Badminton',    image: '/badminton.jpg',  label: 'Book Court' },
  { name: 'Squash',       image: '/squash.jpg',     label: 'Book Court' },
  { name: 'Table Tennis', image: '/tt.jpg',         label: 'Book Table' },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [selectedSport, setSelectedSport] = useState('');

  const handleBookClick = (sport) => {
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="homeContainer">
        <p className="subtitle">IITB SPORTS FACILITY</p>
        <h1 className="mainTitle">
          Book Your <span>Court</span>
        </h1>

        <div className="sportsGrid">
          {SPORTS.map((sport) => (
            <button
              key={sport.name}
              className="sportCard"
              onClick={() => handleBookClick(sport.name)}
              aria-label={`${sport.label} for ${sport.name}`}
            >
              <img src={sport.image} alt={sport.name} />
              <div className="cardOverlay" />
              <div className="cardContent">
                <h2>{sport.name}</h2>
                <span className="bookBtn">{sport.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BookingModal
        sport={selectedSport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}