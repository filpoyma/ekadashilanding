/* ============================================================
   Ekadashi Calendar Alarm — WebLanding Calendar Widget Logic
   - Dynamic month and year rendering (2020-2043 bounds)
   - Dynamic Ekadashi dates, Moon phases, and Parana times
   - Interactive details sidebar panel
   ============================================================ */

(function () {
    "use strict";

    // Calendar state
    let currentYear = 2026;
    let currentMonth = 5; // June is index 5

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function renderDesktopCalendar() {
        const daysGrid = document.getElementById('desktopDaysGrid');
        const monthDisplay = document.getElementById('desktopMonthDisplay');
        if (!daysGrid || !monthDisplay) return;
        
        // Set Header
        monthDisplay.innerText = `${monthNames[currentMonth]} ${currentYear}`;
        daysGrid.innerHTML = '';
        
        // Calculate calendar parameters
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sunday is 0
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Render empty slots for days before 1st of month
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'desktop-day empty-day';
            daysGrid.appendChild(emptyDay);
        }
        
        // Get fasting and moon data for current month from dynamic datasets
        const monthEkadashis = (window.ekadashiDatasetFiltered[currentYear] || {})[currentMonth] || {};
        const monthMoons = (window.moonDatasetFiltered[currentYear] || {})[currentMonth] || { new: [], full: [] };
        
        // Render month days
        let firstEkadashiDay = null;
        let firstEkadashiDiv = null;

        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'desktop-day';
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 'day-number';
            numberSpan.innerText = day;
            dayDiv.appendChild(numberSpan);
            
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'day-indicators';
            dayDiv.appendChild(indicatorDiv);
            
            // Check triggers
            const hasEkadashi = monthEkadashis[day];
            const isNewMoon = monthMoons.new.includes(day);
            const isFullMoon = monthMoons.full.includes(day);
            
            if (hasEkadashi) {
                dayDiv.classList.add('has-ekadashi');
                if (!firstEkadashiDiv) {
                    firstEkadashiDiv = dayDiv;
                    firstEkadashiDay = day;
                }
            }
            if (isNewMoon) {
                dayDiv.classList.add('has-new-moon');
            }
            if (isFullMoon) {
                dayDiv.classList.add('has-full-moon');
            }
            
            // Click action
            dayDiv.addEventListener('click', () => {
                if (hasEkadashi) {
                    document.querySelectorAll('.desktop-day').forEach(el => el.classList.remove('selected-desktop-day'));
                    dayDiv.classList.add('selected-desktop-day');
                    showDesktopCalendarDetails(day, hasEkadashi.name, hasEkadashi.desc, `Exit time: ${hasEkadashi.exit_time}`, 'Fasting Day');
                } else if (isFullMoon) {
                    document.querySelectorAll('.desktop-day').forEach(el => el.classList.remove('selected-desktop-day'));
                    dayDiv.classList.add('selected-desktop-day');
                    showDesktopCalendarDetails(
                        day, 
                        "Purnima — Full Moon", 
                        "Purnima is the day of the full moon, considered highly auspicious in the Vedic lunar calendar. Many practitioners observe a fast (Vrat) or perform prayers. Because the moon's gravity is at its peak, it is a powerful window for spiritual practices, meditation, and mental purification.", 
                        "Best observed with light fasting (fruits/liquids) or Satyanarayan prayers. Fast is usually broken after moonrise or the next morning.", 
                        "Full Moon"
                    );
                } else if (isNewMoon) {
                    document.querySelectorAll('.desktop-day').forEach(el => el.classList.remove('selected-desktop-day'));
                    dayDiv.classList.add('selected-desktop-day');
                    showDesktopCalendarDetails(
                        day, 
                        "Amavasya — New Moon", 
                        "Amavasya represents the new moon night. In traditional practice, it is a time of quiet reflection and is dedicated to honoring ancestors (Pitrus) through prayers and charity. The lack of moonlight encourages turning our awareness inward, making it a perfect time for silence and meditation.", 
                        "Introspection, meditation, and offering charity are recommended practices.", 
                        "New Moon"
                    );
                }
            });
            
            daysGrid.appendChild(dayDiv);
        }

        // Automatically select and display the first Ekadashi of the month by default
        if (firstEkadashiDiv && firstEkadashiDay) {
            firstEkadashiDiv.classList.add('selected-desktop-day');
            const firstEkadashiData = monthEkadashis[firstEkadashiDay];
            showDesktopCalendarDetails(firstEkadashiDay, firstEkadashiData.name, firstEkadashiData.desc, `Exit time: ${firstEkadashiData.exit_time}`, 'Fasting Day');
        }
    }

    function showDesktopCalendarDetails(day, title, desc, parana, badgeText = 'Fasting Day') {
        const contentState = document.getElementById('detailsContentState');
        if (!contentState) return;
        
        // Update badge details
        const badgeEl = contentState.querySelector('.details-badge');
        if (badgeEl) {
            badgeEl.innerText = badgeText;
            if (badgeText === 'Fasting Day') {
                badgeEl.style.backgroundColor = 'var(--peach-soft)';
                badgeEl.style.color = '#C07043';
            } else if (badgeText === 'Full Moon') {
                badgeEl.style.backgroundColor = 'var(--gold-soft)';
                badgeEl.style.color = '#B38D1B';
            } else if (badgeText === 'New Moon') {
                badgeEl.style.backgroundColor = 'var(--bg-cream)';
                badgeEl.style.color = 'var(--ink-soft)';
            }
        }
        
        // Update observation block titles
        const paranaTitleEl = contentState.querySelector('.parana-title span');
        if (paranaTitleEl) {
            paranaTitleEl.innerText = badgeText === 'Fasting Day' ? "Estimated Parana (Fast Break) Window" : "Observation Guide";
        }
        
        const paranaNoticeEl = contentState.querySelector('.parana-notice');
        if (paranaNoticeEl) {
            paranaNoticeEl.innerText = badgeText === 'Fasting Day' 
                ? "Calculated based on standard sunrise times. In the app, you can set your exact city for localized estimations."
                : "In the app, you can observe all lunar cycles and configure reminders for fasting cycles.";
        }

        const titleEl = document.getElementById('desktopDetailsTitle');
        const dateEl = document.getElementById('desktopDetailsDate');
        const descEl = document.getElementById('desktopDetailsDesc');
        const paranaEl = document.getElementById('desktopDetailsParana');

        if (titleEl) titleEl.innerText = title;
        if (dateEl) dateEl.innerText = `${monthNames[currentMonth]} ${day}, ${currentYear}`;
        if (descEl) descEl.innerText = desc;
        if (paranaEl) paranaEl.innerHTML = parana;
    }

    function setupDesktopCalendarNav() {
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');
        if (!prevBtn || !nextBtn) return;

        prevBtn.addEventListener('click', () => {
            if (currentYear === 2020 && currentMonth === 0) return; // Limit to Jan 2020
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderDesktopCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentYear === 2043 && currentMonth === 11) return; // Limit to Dec 2043
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderDesktopCalendar();
        });
    }

    // Initialize calendar on load
    document.addEventListener('DOMContentLoaded', () => {
        // Render calendar
        renderDesktopCalendar();
        setupDesktopCalendarNav();
        
        // Re-init Lucide icons if available
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

})();
