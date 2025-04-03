# Email Blaster

A retro-style web game built with Phaser.js where players shoot emails through moving rings to score points.

## Game Description

Email Blaster is an arcade-style game that challenges players to send emails through the right rings at the right time. The game features:

- Three different colored rings representing "Right Message", "Right Person", and "Right Time"
- Progressive difficulty levels with increasing ring movement and amplitude
- Score system with rewards for perfect shots and penalties for mistakes
- Retro-style graphics with modern visual effects
- Responsive design that works on different screen sizes

## Scoring System

- Perfect shot (all 3 rings): +200 points
- Two rings: -50 points
- Single ring: -100 points

## Controls

- Mouse movement: Aim the email shooter
- Click/tap: Fire email

## Technologies Used

- Phaser 3.55.2
- HTML5
- JavaScript
- CSS3

## Setup

1. Clone the repository:
```bash
git clone https://github.com/bgucci85/email_blaster.git
```

2. Navigate to the project directory:
```bash
cd email_blaster
```

3. Serve the files using a local web server. For example, using Python:
```bash
python -m http.server 8000
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## Directory Structure

```
email_blaster/
├── assets/
│   └── images/
│       ├── email-bullet.png
│       ├── email_fire.png
│       └── email_blaster_cover.png
├── game.js
├── index.html
└── README.md
```

## License

MIT License 