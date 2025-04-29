<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tomás Ferreira</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>
    <div class="background-pattern"></div>
    
    <main class="container">
        <h1 class="main-title">Tomas Ferreira</h1>
        
        <div class="progress-section">
            <span class="progress-text">In Progress...</span>
            <div class="progress-container" data-info="progress-info">
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        </div>

        <div class="icons-container">
            <div class="icon" data-info="education" style="--x: 20; --y: 15;">
                <img src="assets/graduation-cap.png" alt="Education">
            </div>
            <div class="icon" data-info="ideas" style="--x: 80; --y: 25;">
                <img src="assets/lightbulb.png" alt="Ideas">
            </div>
            <div class="icon" data-info="communication" style="--x: 65; --y: 75;">
                <img src="assets/mobile.png" alt="Communication">
            </div>
            <div class="icon" data-info="global" style="--x: 35; --y: 60;">
                <img src="assets/globe.png" alt="Global">
            </div>
            <div class="icon" data-info="work" style="--x: 75; --y: 45;">
                <img src="assets/briefcase.png" alt="Work">
            </div>
            <div class="icon" data-info="tech" style="--x: 45; --y: 35;">
                <img src="assets/computer.png" alt="Technology">
            </div>
            <div class="icon" data-info="fitness" style="--x: 15; --y: 85;">
                <img src="assets/dumbbell.png" alt="Fitness">
            </div>
            <div class="icon" data-info="chat" style="--x: 85; --y: 65;">
                <img src="assets/chat.png" alt="Chat">
            </div>
            <div class="icon" data-info="voice" style="--x: 25; --y: 40;">
                <img src="assets/microphone.png" alt="Voice">
            </div>
            <div class="icon" data-info="innovation" style="--x: 55; --y: 20;">
                <img src="assets/rocket.png" alt="Innovation">
            </div>
            <div class="icon" data-info="knowledge" style="--x: 40; --y: 70;">
                <img src="assets/book.png" alt="Knowledge">
            </div>
        </div>

        <section class="contact" id="contact-section">
            <div class="terminal">
                <div class="terminal-header">
                    <span class="terminal-title">Contact Terminal</span>
                    <div class="terminal-controls">
                        <span class="control minimize">-</span>
                        <span class="control maximize">□</span>
                        <span class="control close">×</span>
                    </div>
                </div>
                <div class="terminal-body">
                    <form id="contact-form">
                        <div class="input-group">
                            <label for="name">NAME:</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="input-group">
                            <label for="email">EMAIL:</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="input-group">
                            <label for="message">MESSAGE:</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">SEND_MESSAGE</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Modals -->
    <div class="modal" id="modal-progress-info">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Current Progress</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-education">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Education</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-ideas">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Ideas & Innovation</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-global">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Global Reach</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-work">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Work Experience</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-tech">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Technology</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-fitness">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Fitness & Health</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-chat">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Communication</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-voice">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Voice & Audio</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-innovation">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Innovation</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <div class="modal" id="modal-knowledge">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 class="modal-title">Knowledge</h2>
            <div class="modal-text"></div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
