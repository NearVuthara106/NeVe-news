// ១. មុខងារបញ្ជាបើក/បិទ ម៉ឺនុយត្រេបី (Hamburger Menu)
const openMenuBtn = document.getElementById('openMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const blurOverlay = document.getElementById('blurOverlay');

function toggleMenu(isOpen) {
    if (isOpen) {
        menuOverlay.classList.add('active');
        blurOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        menuOverlay.classList.remove('active');
        blurOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

openMenuBtn.addEventListener('click', () => toggleMenu(true));
closeMenuBtn.addEventListener('click', () => toggleMenu(false));
blurOverlay.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// ២. ប្រព័ន្ធ AI/JS Auto-Update ទាញយកព័ត៌មានភាសាខ្មែរ និងរូបភាពពិតៗ
document.addEventListener("DOMContentLoaded", function() {
    // ប្រើប្រាស់ RSS ភាសាខ្មែរពិតៗពីប្រភពព័ត៌មានល្បីៗ
    const camRss = 'https://www.rfi.fr/km/cambodia/rss'; // ព័ត៌មានក្នុងប្រទេស
    const intRss = 'https://www.rfi.fr/km/general/rss';  // ព័ត៌មានអន្តរជាតិ

    function loadRealNews(rssUrl, containerId, badgeLabel) {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const container = document.getElementById(containerId);

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items.length > 0) {
                    container.innerHTML = ''; // លុបផ្ទាំង Loading
                    
                    // យក ៦ អត្ថបទចុងក្រោយបង្អស់
                    const articles = data.items.slice(0, 6);
                    articles.forEach(item => {
                        // ១. ទាញយករូបភាពពិតពីអត្ថបទ (បើគ្មានទេ ប្រើរូបភាពដំណឹងលំនាំដើម)
                        let imgUrl = item.thumbnail || item.enclosure.link || '';
                        
                        // ប្រសិនបើប្រព័ន្ធរកមិនឃើញរូបភាពក្នុង Tag ធម្មតា វាជួយទាញរូបភាពពី Description
                        if (!imgUrl && item.description) {
                            const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                            if (imgMatch && imgMatch[1]) {
                                imgUrl = imgMatch[1];
                            }
                        }
                        
                        // បើនៅតែគ្មានរូបភាព ប្រើរូបភាពដំណឹងទូទៅដែលមើលទៅសមរម្យ
                        if (!imgUrl) {
                            imgUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600';
                        }

                        // ២. សម្អាតអត្ថបទពិពណ៌នា (Description) ឱ្យនៅខ្លី ងាយស្រួលអាន
                        let shortDesc = '';
                        if (item.description) {
                            // លុប Tag HTML ផ្សេងៗចេញឱ្យសល់តែអក្សរស្អាត
                            shortDesc = item.description.replace(/<[^>]*>/g, '');
                            // កាត់យកត្រឹម ១២០ តួអក្សរដើម្បីកុំឱ្យវែងពេក
                            if (shortDesc.length > 120) {
                                shortDesc = shortDesc.substring(0, 120) + '...';
                            }
                        }

                        const card = document.createElement('div');
                        card.className = 'news-card';
                        card.innerHTML = `
                            <div class="news-img-wrapper">
                                <span class="news-category">${badgeLabel}</span>
                                <img src="${imgUrl}" class="news-img" alt="News Image" onerror="this.src='https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'">
                            </div>
                            <div class="news-info">
                                <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
                                <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 12px;">${shortDesc}</p>
                                <div class="news-date">⏱️ ថ្ងៃខែ៖ ${new Date(item.pubDate).toLocaleDateString()}</div>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = '<div class="loading">❌ មិនអាចទាញយកទិន្នន័យព័ត៌មានបានឡើយ។</div>';
                }
            })
            .catch(err => {
                container.innerHTML = '<div class="loading">⚠️ មានបញ្ហាការតភ្ជាប់អ៊ីនធឺណិត។</div>';
            });
    }

    // ដំណើរការប្រព័ន្ធទាញយកអូតូ
    loadRealNews(camRss, 'cambodia-container', 'កម្ពុជា');
    loadRealNews(intRss, 'international-container', 'អន្តរជាតិ');
});
