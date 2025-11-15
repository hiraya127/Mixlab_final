 (function(){
      // Get user data
      const raw = localStorage.getItem('user');
      let user = null;
      try { user = raw ? JSON.parse(raw) : null; } catch(e) { user = null; }

      function getName(u){ 
        if(!u) return null; 
        return u.username || u.name || u.fullname || u.email || 'MixLab User'; 
      }

      const name = getName(user);
      const userNameEl = document.getElementById('userName');
      const emailEl = document.getElementById('email');
      const fullNameEl = document.getElementById('fullName');
      const usernameEl = document.getElementById('username');
      
      if(userNameEl) userNameEl.textContent = name;
      if(emailEl) emailEl.textContent = user && user.email ? user.email : 'user@mixlab.com';
      if(fullNameEl) fullNameEl.textContent = name;
      if(usernameEl) usernameEl.textContent = user && user.username ? user.username : 'mixlab_user';

      // Set avatar initial
      const avatarEl = document.getElementById('userAvatar');
      if(avatarEl && name) {
        avatarEl.textContent = name.charAt(0).toUpperCase();
      }

      // Badge system - Users earn badges through various activities
      const badges = [
        { id: 1, icon: '🎵', name: 'First Session', unlocked: true, desc: 'Complete your first booking' },
        { id: 2, icon: '🎸', name: 'Instrument Pro', unlocked: true, desc: 'Master 3 instruments' },
        { id: 3, icon: '🎧', name: 'Mix Master', unlocked: true, desc: 'Complete 10 mixing sessions' },
        { id: 4, icon: '⭐', name: 'Rising Star', unlocked: true, desc: 'Reach Level 5' },
        { id: 5, icon: '🔥', name: '7-Day Streak', unlocked: true, desc: 'Practice 7 days in a row' },
        { id: 6, icon: '💎', name: 'Premium User', unlocked: true, desc: 'Subscribe to premium' },
        { id: 7, icon: '🎯', name: 'Goal Getter', unlocked: true, desc: 'Complete 5 challenges' },
        { id: 8, icon: '👥', name: 'Social Mixer', unlocked: true, desc: 'Refer 3 friends' },
        { id: 9, icon: '🏆', name: 'Champion', unlocked: false, desc: 'Win 5 competitions' },
        { id: 10, icon: '🌟', name: 'Legend', unlocked: false, desc: 'Reach Level 10' },
        { id: 11, icon: '🎼', name: 'Composer', unlocked: false, desc: 'Create 20 tracks' },
        { id: 12, icon: '🎤', name: 'Vocalist', unlocked: false, desc: 'Record 15 vocal sessions' },
      ];

      const badgesGrid = document.getElementById('badgesGrid');
      if(badgesGrid) {
        badges.forEach(badge => {
          const badgeEl = document.createElement('div');
          badgeEl.className = `badge-item ${badge.unlocked ? '' : 'locked'}`;
          badgeEl.title = badge.desc;
          badgeEl.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
          `;
          badgesGrid.appendChild(badgeEl);
        });
      }

      // Achievement system - Recent accomplishments
      const achievements = [
        { icon: '🎯', name: '5-Session Streak', desc: 'Booked sessions 5 days in a row', date: '2 days ago' },
        { icon: '⭐', name: 'Level Up!', desc: 'Reached Level 5', date: '5 days ago' },
        { icon: '🎵', name: 'Beat Master', desc: 'Completed Rhythm Challenge', date: '1 week ago' },
        { icon: '💯', name: 'Perfect Score', desc: 'Got 100% in Ear Training', date: '2 weeks ago' },
      ];

      const achievementsList = document.getElementById('achievementsList');
      if(achievementsList) {
        achievements.forEach(achievement => {
          const achEl = document.createElement('div');
          achEl.className = 'achievement-item';
          achEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-details">
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-desc">${achievement.desc}</div>
            </div>
            <div class="achievement-date">${achievement.date}</div>
          `;
          achievementsList.appendChild(achEl);
        });
      }

      // Booking History
      const bookings = [
        { name: 'Studio A Recording', date: 'Nov 12, 2025', status: 'Completed' },
        { name: 'Mixing Session', date: 'Nov 10, 2025', status: 'Completed' },
        { name: 'Vocal Recording', date: 'Nov 8, 2025', status: 'Completed' },
        { name: 'Beat Production', date: 'Nov 15, 2025', status: 'Upcoming' },
        { name: 'Mastering Session', date: 'Nov 18, 2025', status: 'Upcoming' },
      ];

      const bookingHistory = document.getElementById('bookingHistory');
      if(bookingHistory) {
        bookings.forEach(booking => {
          const bookingEl = document.createElement('div');
          bookingEl.className = 'history-item';
          bookingEl.innerHTML = `
            <span>${booking.name}</span>
            <span class="history-date">${booking.date}</span>
          `;
          bookingHistory.appendChild(bookingEl);
        });
      }

      // Notification toggles
      const notifications = [
        { id: 'bookingReminder', label: 'Booking Reminders', active: true },
        { id: 'levelUp', label: 'Level Up Notifications', active: true },
        { id: 'newBadge', label: 'New Badge Alerts', active: true },
        { id: 'weeklyReport', label: 'Weekly Progress Report', active: false },
        { id: 'friendActivity', label: 'Friend Activity', active: true },
      ];

      const notificationToggles = document.getElementById('notificationToggles');
      if(notificationToggles) {
        notifications.forEach(notif => {
          const toggleEl = document.createElement('div');
          toggleEl.className = 'notification-toggle';
          toggleEl.innerHTML = `
            <span>${notif.label}</span>
            <div class="toggle-switch ${notif.active ? 'active' : ''}" data-id="${notif.id}">
              <div class="toggle-slider"></div>
            </div>
          `;
          
          toggleEl.addEventListener('click', function() {
            const toggle = this.querySelector('.toggle-switch');
            toggle.classList.toggle('active');
          });
          
          notificationToggles.appendChild(toggleEl);
        });
      }

      // Logout functionality
      const logoutBtn = document.getElementById('profileLogout');
      const logoutBtnMobile = document.getElementById('profileLogoutMobile');
      
      function handleLogout() {
        if(confirm('Logout from MixLab?')){
          try { 
            localStorage.removeItem('token'); 
            localStorage.removeItem('user'); 
            sessionStorage.clear(); 
          } catch(e){}
          window.location.href = '../login/login.html';
        }
      }
      
      if(logoutBtn){
        logoutBtn.addEventListener('click', handleLogout);
      }
      
      if(logoutBtnMobile){
        logoutBtnMobile.addEventListener('click', handleLogout);
      }
    })();