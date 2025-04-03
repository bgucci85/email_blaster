const GAME_WIDTH = 1200;
const GAME_HEIGHT = 675;
const SHOOT_COOLDOWN = 500; // 0.5 seconds between shots
const LEVEL_DURATION = 10000; // 10 seconds per level

// Level configurations
const LEVEL_CONFIGS = [
    { speedMultiplier: 0.75, amplitude: 40, name: "Level 1" }, // 25% slower, 40px amplitude
    { speedMultiplier: 0.9, amplitude: 60, name: "Level 2" },  // 10% slower, 60px amplitude
    { speedMultiplier: 1.0, amplitude: 90, name: "Level 3" }   // Current speed, 90px amplitude
];

// Base ring speeds (current speeds)
const BASE_SPEEDS = [1.44, 1.92, 2.4]; // 20% increase from previous values

// Add font style configurations
const FONT_CONFIG = {
    score: {
        font: 'bold 32px Arial',
        fill: '#ffffff',
        shadow: { color: '#000000', blur: 2, fill: true }
    },
    points: {
        font: 'bold 18px Arial',
        fill: '#ffff00',
        shadow: { color: '#000000', blur: 2, fill: true }
    },
    perfect: {
        font: 'bold 24px Arial',
        fill: '#ffff00',
        shadow: { color: '#000000', blur: 3, fill: true }
    },
    timer: {
        font: 'bold 40px Arial',
        fill: '#ff0000',
        shadow: { color: '#000000', blur: 2, fill: true }
    },
    level: {
        font: 'bold 24px Arial',
        fill: '#00ffff',
        shadow: { color: '#000000', blur: 3, fill: true }
    },
    countdown: {
        font: 'bold 48px Arial',
        fill: '#ffffff',
        shadow: { color: '#000000', blur: 4, fill: true }
    },
    ringLabel: {
        font: 'bold 12px Arial',
        fill: '#ffffff',
        shadow: { color: '#000000', blur: 2, fill: true }
    }
};

// Add countdown configuration
const COUNTDOWN_DURATION = 3000; // 3 seconds in milliseconds

// Add ring style configurations
const RING_STYLES = {
    outer: {
        mainColor: 0xff4444,
        glowColor: 0xff0000,
        thickness: 4,
        glowAlpha: 0.2,
        glowSize: 15
    },
    middle: {
        mainColor: 0x44ff44,
        glowColor: 0x00ff00,
        thickness: 4,
        glowAlpha: 0.2,
        glowSize: 15
    },
    inner: {
        mainColor: 0x4444ff,
        glowColor: 0x0000ff,
        thickness: 4,
        glowAlpha: 0.2,
        glowSize: 15
    }
};

// Add loading screen configuration
const LOADING_TEXT = {
    message: [
        "As you know, Omnisend automation & segmentation let you send the right message to the right person at the right time",
        "",
        "Your mission is to get that message through.",
        "",
        "Or die tryin'."
    ]
};

class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        // Load both email sprites and cover image
        this.load.image('email-bullet', 'assets/images/email-bullet.png');
        this.load.image('email-fire', 'assets/images/email_fire.png');
        this.load.image('cover-image', 'assets/images/email_blaster_cover.png');

        // Add detailed loading event handlers
        this.load.on('filecomplete', (key, type, data) => {
            console.log(`Successfully loaded: ${key}`);
        });

        this.load.on('complete', () => {
            console.log('All assets loaded successfully');
            // Verify textures are available
            ['email-bullet', 'email-fire', 'cover-image'].forEach(key => {
                if (this.textures.exists(key)) {
                    console.log(`Texture ${key} is available`);
                } else {
                    console.error(`Texture ${key} is missing`);
                }
            });
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key, file.src);
            console.error('Type:', file.type);
            console.error('URL:', file.url);
        });
    }

    create() {
        // Create black background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000).setOrigin(0);

        // Add cover image on the left
        const cover = this.add.image(GAME_WIDTH * 0.3, GAME_HEIGHT * 0.5, 'cover-image');
        
        // Scale the cover image to fit the left half while maintaining aspect ratio
        const scale = Math.min(
            (GAME_WIDTH * 0.5) / cover.width,
            (GAME_HEIGHT * 0.8) / cover.height
        );
        cover.setScale(scale);
        cover.setAlpha(0);

        // Add the text messages on the right side
        const startX = GAME_WIDTH * 0.75; // Move text more to the right
        const startY = GAME_HEIGHT * 0.25; // Start higher
        const lineSpacing = 50; // Increased spacing for larger text

        // Add text with consistent formatting
        LOADING_TEXT.message.forEach((line, index) => {
            const y = startY + (index * lineSpacing);
            const style = {
                font: '24px Arial', // Increased by 25% from 19px
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: GAME_WIDTH * 0.4 }
            };
            
            // Make the mission statement bold but same size
            if (index === 4) {
                style.font = 'bold 24px Arial';
            }
            
            const text = this.add.text(startX, y, line, style)
                .setOrigin(0.5)
                .setAlpha(0);
        });

        // Fade in cover image first
        this.tweens.add({
            targets: cover,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        // Fade in each line sequentially
        let delay = 1000; // Start text fade-in after cover
        const texts = this.children.list.filter(child => 
            child instanceof Phaser.GameObjects.Text
        );
        
        texts.forEach((text, index) => {
            this.tweens.add({
                targets: text,
                alpha: 1,
                duration: 1000,
                delay: delay + (index * 800),
                ease: 'Power2'
            });
        });

        // Add "Click to start" text after a delay
        this.time.delayedCall(5000, () => {
            const startText = this.add.text(
                startX,
                GAME_HEIGHT * 0.8,
                'Click to start',
                {
                    font: 'bold 35px Arial',
                    fill: '#00ff00',
                    shadow: { color: '#000000', blur: 4, fill: true }
                }
            ).setOrigin(0.5).setAlpha(0);

            // Fade in and pulse the start text
            this.tweens.add({
                targets: startText,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.tweens.add({
                        targets: startText,
                        scale: 1.1,
                        duration: 1500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            });

            // Add click handler to start the game
            this.input.on('pointerdown', () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('GameScene');
                });
            });
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.rings = [];
        this.score = 0;
        this.canShoot = true;
        this.lastShootTime = 0;
        this.currentLevel = 0;
        this.levelStartTime = 0;
        this.stars = [];
        this.isCountingDown = false;
    }

    createStarryBackground() {
        // Create more stars but make them smaller
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(0, GAME_HEIGHT),
                Phaser.Math.Between(0.5, 1), // Smaller stars
                0xFFFFFF,
                Phaser.Math.Between(0.2, 0.8)
            );
            
            // Add velocity and depth properties
            star.velocity = Phaser.Math.Between(1, 3);
            star.setData('initialScale', star.scale);
            
            this.stars.push(star);
        }
    }

    showCountdown(onComplete) {
        this.isCountingDown = true;
        
        // Disable shooting during countdown
        this.canShoot = false;
        
        // Create semi-transparent overlay
        const overlay = this.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            0x000000,
            0.5
        );

        // Create countdown text
        const countdownText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            '3',
            FONT_CONFIG.countdown
        ).setOrigin(0.5);

        // Countdown sequence
        let count = 3;
        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownText.setText(count.toString());
                
                // Add scale animation for each number
                this.tweens.add({
                    targets: countdownText,
                    scale: { from: 1.5, to: 1 },
                    duration: 500,
                    ease: 'Power2'
                });
            } else {
                clearInterval(countInterval);
                
                // Show "GO!" text
                countdownText.setText('GO!');
                countdownText.setScale(1.5);
                
                // Animate "GO!" text
                this.tweens.add({
                    targets: countdownText,
                    scale: { from: 1.5, to: 1 },
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        countdownText.destroy();
                        overlay.destroy();
                        this.isCountingDown = false;
                        this.canShoot = true;
                        if (onComplete) onComplete();
                    }
                });
            }
        }, 1000);
    }

    startLevel(levelIndex) {
        this.currentLevel = levelIndex;
        const config = LEVEL_CONFIGS[levelIndex];
        
        // Show level text
        const levelText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 - 40,
            config.name,
            FONT_CONFIG.level
        ).setOrigin(0.5);

        // Start countdown, then begin the level
        this.showCountdown(() => {
            levelText.destroy();
            
            // Update ring configurations
            this.rings.forEach((ring, index) => {
                ring.speed = BASE_SPEEDS[index] * config.speedMultiplier;
                ring.amplitude = config.amplitude;
            });
            
            // Set level start time after countdown
            this.levelStartTime = this.time.now;
        });
    }

    preload() {
        // Load both email sprites and cover image
        this.load.image('email-bullet', 'assets/images/email-bullet.png');
        this.load.image('email-fire', 'assets/images/email_fire.png');
        this.load.image('cover-image', 'assets/images/email_blaster_cover.png');
        
        // Add debug logging for asset loading
        this.load.on('complete', () => {
            console.log('Assets loaded successfully');
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.src);
            // Create fallback textures if needed
            const graphics = this.add.graphics();
            graphics.fillStyle(0xFFFFFF);
            graphics.fillCircle(0, 0, 8);
            graphics.generateTexture('email-bullet', 16, 16);
            graphics.generateTexture('email-fire', 16, 16);
            graphics.destroy();
        });
    }

    createRing(config, style) {
        const container = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // Create glow layer
        const glowLayer = this.add.graphics();
        glowLayer.lineStyle(style.thickness + style.glowSize, style.glowColor, style.glowAlpha);
        glowLayer.strokeCircle(0, 0, config.radius);
        container.add(glowLayer);

        // Create main ring
        const ring = this.add.graphics();
        ring.lineStyle(style.thickness, style.mainColor, 1);
        ring.strokeCircle(0, 0, config.radius);
        container.add(ring);

        // Create curved text around the ring
        const text = config.name;
        const characters = text.split('');
        const radius = config.radius + 15; // Position text slightly outside the ring
        const angleStep = (Math.PI / 2) / (characters.length - 1); // Spread text over 90 degrees
        const startAngle = -Math.PI / 4; // Start at -45 degrees

        characters.forEach((char, index) => {
            const angle = startAngle + (angleStep * index);
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const charText = this.add.text(x, y, char, FONT_CONFIG.ringLabel)
                .setOrigin(0.5)
                .setRotation(angle + Math.PI / 2); // Rotate each character to face outward

            container.add(charText);
        });

        // Add subtle pulsing animation
        this.tweens.add({
            targets: container,
            scaleX: { from: 1, to: 1.01 },
            scaleY: { from: 1, to: 1.01 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Store properties
        container.baseX = container.x;
        container.speed = 1;
        container.amplitude = 20;
        container.radius = config.radius;
        container.name = config.name;
        container.angle = 0;

        return container;
    }

    create() {
        this.createStarryBackground();

        // Initialize score with enhanced text style
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0', FONT_CONFIG.score);
        
        // Add timer text with error handling
        try {
            this.timerText = this.add.text(
                GAME_WIDTH - 10,
                10,
                '10',
                FONT_CONFIG.timer
            ).setOrigin(1, 0);
        } catch (error) {
            console.error('Error creating timer text:', error);
            this.timerText = null;
        }

        // Create rings with modern effects
        const ringConfigs = [
            { radius: 140, name: 'Right Message', style: RING_STYLES.outer },
            { radius: 100, name: 'Right Person', style: RING_STYLES.middle },
            { radius: 60, name: 'Right Time', style: RING_STYLES.inner }
        ];

        this.rings = ringConfigs.map((config, index) => 
            this.createRing(config, config.style)
        );

        // Add email shooter sprite
        this.emailShooter = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'email-bullet');
        this.emailShooter.setScale(0.09)  // Reduced by 40% from 0.15
                       .setOrigin(0.5)
                       .setDepth(1);

        // Setup input
        this.input.on('pointerdown', this.shootEmail, this);
        this.input.on('pointermove', this.aimEmail, this);

        // Group for active emails
        this.activeEmails = this.add.group();

        // Initialize shooting angle
        this.shooterAngle = 0;

        // Start first level
        this.startLevel(0);
    }

    aimEmail(pointer) {
        // Calculate angle between shooter and pointer
        const dx = pointer.x - GAME_WIDTH / 2;
        const dy = pointer.y - (GAME_HEIGHT - 30);
        this.shooterAngle = Math.atan2(dy, dx);
        
        // Update shooter rotation
        this.emailShooter.setRotation(this.shooterAngle);
    }

    shootEmail() {
        const currentTime = this.time.now;
        
        if (!this.canShoot || currentTime - this.lastShootTime < SHOOT_COOLDOWN) {
            return;
        }

        try {
            // Create email sprite with fire effect
            const email = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'email-fire');
            console.log('Email projectile created:', email);
            
            // Ensure proper sprite configuration
            email.setScale(0.036)  // Reduced by 50% from 0.072
                .setOrigin(0.5)
                .setDepth(1);
            
            // Set the rotation based on the shooter angle
            email.setRotation(this.shooterAngle);

            // Add velocity based on angle
            const speed = 10;
            email.velocityX = Math.cos(this.shooterAngle) * speed;
            email.velocityY = Math.sin(this.shooterAngle) * speed;
            
            this.activeEmails.add(email);
            email.hitRings = new Set();

            // Reset shooting cooldown
            this.canShoot = false;
            this.lastShootTime = currentTime;
            this.time.delayedCall(SHOOT_COOLDOWN, () => {
                this.canShoot = true;
            });
        } catch (error) {
            console.error('Error creating email projectile:', error);
        }
    }

    checkEmailRingCollision(email, ring) {
        const dx = email.x - ring.x;
        const dy = email.y - ring.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const tolerance = 12;
        if (Math.abs(distance - ring.radius) < tolerance) {
            if (!email.hitRings.has(ring.name)) {
                email.hitRings.add(ring.name);
                
                // Add subtle flash effect on the ring itself
                const flash = this.add.graphics();
                flash.lineStyle(4, 0xffffff, 0.3);
                flash.strokeCircle(ring.x, ring.y, ring.radius);
                
                // Fade out the flash effect
                this.tweens.add({
                    targets: flash,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => flash.destroy()
                });

                // Calculate score immediately after hitting each ring
                this.updateScore(email.hitRings);
            }
        }
    }

    updateScore(hitRings) {
        let pointsEarned = 0;
        let message = '';
        let textColor = '#ff0000'; // Default to red for penalties
        let textStyle = { ...FONT_CONFIG.points }; // Clone the base style

        // Simplified scoring conditions
        if (hitRings.size === 3) {
            // Perfect shot through all rings
            pointsEarned = 200;
            message = 'Perfect! +200';
            textColor = '#00ff00'; // Green for perfect shots only
        } else if (hitRings.size === 2) {
            // Two rings penalty
            pointsEarned = -50;
            message = '-50';
        } else if (hitRings.size === 1) {
            // Single ring penalty
            pointsEarned = -100;
            message = '-100';
        }

        // Only show score if points were earned/lost
        if (pointsEarned !== 0) {
            // Update score
            this.score = Math.max(0, this.score + pointsEarned); // Prevent negative scores
            this.scoreText.setText('Score: ' + this.score);

            // Show floating score text
            textStyle.fill = textColor;
            const floatingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, message, textStyle)
                .setOrigin(0.5)
                .setFontSize(pointsEarned > 0 ? 32 : 24); // Larger text for perfect shots

            // Add scale effect for perfect shots only
            if (pointsEarned > 0) {
                this.tweens.add({
                    targets: floatingText,
                    scale: { from: 1.5, to: 1 },
                    duration: 500,
                    ease: 'Back.easeOut'
                });
            }

            // Animate the floating text
            this.tweens.add({
                targets: floatingText,
                y: floatingText.y - 50,
                alpha: 0,
                duration: pointsEarned > 0 ? 2000 : 1500, // Longer duration for perfect shots
                ease: 'Power1',
                onComplete: () => {
                    floatingText.destroy();
                }
            });

            // Debug logging
            console.log('Rings hit:', Array.from(hitRings), 'Points earned:', pointsEarned);
        }
    }

    update(time, delta) {
        // Skip updates during countdown
        if (this.isCountingDown) {
            return;
        }

        // Update timer and check for level completion
        const timeElapsed = time - this.levelStartTime;
        const timeRemaining = Math.max(0, Math.ceil((LEVEL_DURATION - timeElapsed) / 1000));
        
        // Only update timer text if it exists
        if (this.timerText) {
            this.timerText.setText(timeRemaining.toString());
        }

        if (timeElapsed >= LEVEL_DURATION) {
            if (this.currentLevel < LEVEL_CONFIGS.length - 1) {
                this.startLevel(this.currentLevel + 1);
            } else {
                // Game Over
                const overlay = this.add.rectangle(
                    GAME_WIDTH / 2,
                    GAME_HEIGHT / 2,
                    GAME_WIDTH,
                    GAME_HEIGHT,
                    0x000000,
                    0.7
                );
                
                const finalText = this.add.text(
                    GAME_WIDTH / 2,
                    GAME_HEIGHT / 2,
                    'Game Over!\nFinal Score: ' + this.score,
                    FONT_CONFIG.perfect
                ).setOrigin(0.5);
                
                // Stop the game
                this.scene.pause();
            }
        }

        // Update stars
        this.stars.forEach(star => {
            star.y += star.velocity;
            
            const progress = star.y / GAME_HEIGHT;
            star.setScale(star.getData('initialScale') * (1 + progress * 0.5));
            
            if (star.y > GAME_HEIGHT) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, GAME_WIDTH);
                star.setScale(star.getData('initialScale'));
            }
            
            if (Math.random() < 0.005) {
                star.setAlpha(Phaser.Math.Between(20, 80) / 100);
            }
        });

        // Update ring positions
        this.rings.forEach((ring) => {
            ring.angle = (ring.angle || 0) + 0.02 * ring.speed;
            ring.x = ring.baseX + Math.sin(ring.angle) * ring.amplitude;
        });

        // Update email positions and check ring pass-through
        this.activeEmails.getChildren().forEach((email) => {
            email.x += email.velocityX;
            email.y += email.velocityY;
            
            // Update rotation to match movement
            email.rotation = Math.atan2(email.velocityY, email.velocityX);

            this.rings.forEach((ring) => {
                this.checkEmailRingCollision(email, ring);
            });

            // Only remove emails when they go off screen
            if (email.y < -10 || email.y > GAME_HEIGHT + 10 ||
                email.x < -10 || email.x > GAME_WIDTH + 10) {
                email.destroy();
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [LoadingScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    backgroundColor: '#000000',
    antialias: true,
    render: {
        powerPreference: 'high-performance'
    }
};

const game = new Phaser.Game(config); 