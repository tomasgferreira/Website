document.addEventListener('DOMContentLoaded', () => {
    const iconContent = {
        'progress-info': {
            title: "Current Progress",
            text: "Developing skills and knowledge in various areas of technology and business."
        },
        education: {
            title: "Education",
            text: "Bachelor in Computer Science and Business Management"
        },
        ideas: {
            title: "Ideas & Innovation",
            text: "Helping parents read cooler bedtime stories"
        },
        mobile: {
            title: "Contact Form",
            text: "Scroll down to the contact form below"
        },
        communication: {
            title: "Communication",
            text: "Sales Representative at Philip Morris International"
        },
        global: {
            title: "Global Reach",
            text: "Working with international teams and clients"
        },
        work: {
            title: "Work Experience",
            text: "Promoter in all kinds of events"
        },
        tech: {
            title: "Technology",
            text: "Passionate about coding and new technologies"
        },
        fitness: {
            title: "Fitness & Health",
            text: "Committed to maintaining a healthy lifestyle and regular exercise"
        },
        chat: {
            title: "Communication",
            text: "Excellent interpersonal and communication skills"
        },
        voice: {
            title: "Voice & Audio",
            text: "Experience in audio production and voice work"
        },
        innovation: {
            title: "Innovation",
            text: "Always seeking new ways to solve problems and improve processes"
        },
        knowledge: {
            title: "Knowledge",
            text: "Continuous learner and knowledge seeker"
        }
    };

    // Create modals dynamically for all icons
    Object.keys(iconContent).forEach(key => {
        const modalHTML = `
            <div id="modal-${key}" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2 class="modal-title">${iconContent[key].title}</h2>
                    <p class="modal-text"></p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    });

    function typeText(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        element.classList.add('typing');

        return new Promise(resolve => {
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                    resolve();
                }
            }
            type();
        });
    }

    // Handle all clickable elements
    document.addEventListener('click', async (e) => {
        const icon = e.target.closest('.icon');
        const progressContainer = e.target.closest('.progress-container');
        
        if (icon || progressContainer) {
            const info = (icon ? icon : progressContainer).getAttribute('data-info');
            
            if (info === 'mobile') {
                document.getElementById('contact-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                return;
            }

            const modal = document.getElementById(`modal-${info}`);
            if (modal) {
                const modalText = modal.querySelector('.modal-text');
                modal.style.display = 'block';
                await typeText(modalText, iconContent[info].text);
            }
        }
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Form handling
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        form.reset();
    });

    // Terminal controls functionality
    const controls = document.querySelectorAll('.control');
    const terminal = document.querySelector('.terminal');

    controls.forEach(control => {
        control.addEventListener('click', () => {
            if (control.classList.contains('minimize')) {
                terminal.style.transform = 'scale(0.8)';
            } else if (control.classList.contains('maximize')) {
                terminal.style.transform = 'scale(1)';
            } else if (control.classList.contains('close')) {
                terminal.style.display = 'none';
                setTimeout(() => {
                    terminal.style.display = 'block';
                }, 1000);
            }
        });
    });
});
