(function () {
    'use strict';

    /* ---------- Theme ---------- */

    const root = document.documentElement;

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });

    // Follow system preference as long as the user hasn't picked a theme.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let saved = null;
        try { saved = localStorage.getItem('theme'); } catch (err) { /* private mode */ }
        if (!saved) root.dataset.theme = e.matches ? 'dark' : 'light';
    });

    /* ---------- Rendering ---------- */

    const esc = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    // company/institution are trusted HTML snippets from the data files
    const subtitle = (htmlPart, ...textParts) =>
        [htmlPart, ...textParts.map(esc)].join(' • ');

    const stripTags = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    };

    const sectionBody = (id) => document.querySelector('#section-' + id + ' .section-body');

    // The whole list item is a link, so the company link markup is stripped
    // here (nested anchors are invalid HTML); it stays clickable in the detail view.
    sectionBody('experiences').innerHTML = Object.entries(experienceMap).map(([id, exp]) => `
        <a href="#cv/experience/${id}" class="experience-item link">
            <h3>${esc(exp.title)}</h3>
            <p class="role-subtitle">${subtitle(esc(stripTags(exp.company)), exp.location, exp.period)}</p>
            <p class="experience-summary">${esc(exp.description)}</p>
        </a>
    `).join('');

    sectionBody('skills').innerHTML = Object.entries(skills).map(([section, list]) => `
        <div class="skill-item">
            <h3>${esc(section)}</h3>
            <p>${esc(list.join(', '))}</p>
        </div>
    `).join('');

    sectionBody('education').innerHTML = educations.map((edu) => `
        <div class="education-item">
            <h3>${esc(edu.title)}</h3>
            <p class="role-subtitle">${subtitle(edu.institution, edu.location, edu.startYear + ' - ' + edu.endYear)}</p>
            <p>${edu.description}</p>
        </div>
    `).join('');

    sectionBody('languages').innerHTML = Object.entries(languages).map(([language, level]) => `
        <div class="language-item">
            <span>${esc(language)}</span>
            <span class="level">${esc(level)}</span>
        </div>
    `).join('');

    const renderExperienceDetail = (id) => {
        const exp = experienceMap[id];
        sectionBody('experience-detail').innerHTML = `
            <h2>${esc(exp.title)}</h2>
            <p class="role-subtitle">${subtitle(exp.company, exp.location, exp.period)}</p>
            <div class="experience-body">${exp.body}</div>
            <p class="detail-footer"><a class="subtext" href="#cv">← Back to CV</a></p>
        `;
    };

    /* ---------- Routing ---------- */

    const pages = {
        home: document.getElementById('page-home'),
        cv: document.getElementById('page-cv'),
    };
    const sections = ['experiences', 'experience-detail', 'skills', 'education', 'languages'];
    const navLinks = document.querySelectorAll('.cv-nav .nav-btn');
    const cvMain = document.querySelector('.cv-main');

    function show(page, section) {
        Object.entries(pages).forEach(([name, el]) => { el.hidden = name !== page; });
        if (page !== 'cv') return;
        sections.forEach((name) => {
            document.getElementById('section-' + name).hidden = name !== section;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === section);
        });
        cvMain.scrollTop = 0;
    }

    function route() {
        const hash = window.location.hash.slice(1);
        const expId = hash.startsWith('cv/experience/') ? hash.split('/')[2] : null;

        if (hash === 'cv' || hash === 'cv/experiences') {
            history.replaceState(null, '', '#cv/experiences');
            show('cv', 'experiences');
        } else if (expId && experienceMap[expId]) {
            renderExperienceDetail(expId);
            show('cv', 'experience-detail');
        } else if (['cv/skills', 'cv/education', 'cv/languages'].includes(hash)) {
            show('cv', hash.split('/')[1]);
        } else {
            show('home');
        }
    }

    window.addEventListener('hashchange', route);
    route();
})();
