/**
 * ==============================================================================
 * MD. NAZIR MORSED ARCHITECTURAL STUDIO — CLIENT ENGINE & PORTFOLIO CMS
 * ==============================================================================
 * Lead Architect: MD. Nazir Morsed (B.Arch)
 * Primary Administrative Email: nazirmorsed722@gmail.com
 * Core Competencies: Spatial Planning, Sustainable Architecture, Precision Drafting
 * Software Stack: AutoCAD, Revit BIM, SketchUp, Lumion
 * ==============================================================================
 */

(function () {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. STORAGE KEYS & CONSTANTS
  // ----------------------------------------------------------------------------
  const STORAGE_KEY = 'nazir_morsed_projects_v3';
  const SESSION_AUTH_KEY = 'nazir_morsed_admin_session';
  const PASSWORD_KEY = 'nazir_morsed_password_v3';
  const THEME_KEY = 'nazir_morsed_theme_v2';
  const INBOX_KEY = 'nazir_morsed_inquiries_v2';
  
  const ADMIN_EMAIL = 'nazirmorsed722@gmail.com';
  const ADMIN_USERNAME = 'nazir_morsed';
  const DEFAULT_PASSWORD = 'Na111222';

  // ----------------------------------------------------------------------------
  // INDEXEDDB VIDEO STORAGE SYSTEM (HIGH-CAPACITY LOCAL VIDEO BLOB PERSISTENCE)
  // ----------------------------------------------------------------------------
  const DB_NAME = 'NazirMorsedArchitectDB';
  const DB_VERSION = 1;
  const STORE_VIDEOS = 'projectVideos';

  let dbPromise = null;

  function getDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported in this browser environment.');
        resolve(null);
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
          db.createObjectStore(STORE_VIDEOS, { keyPath: 'projectId' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (err) => {
        console.error('IndexedDB open error:', err);
        resolve(null);
      };
    });
    return dbPromise;
  }

  async function storeProjectVideo(projectId, fileBlob, fileName, fileSize) {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_VIDEOS, 'readwrite');
        const store = tx.objectStore(STORE_VIDEOS);
        const item = {
          projectId,
          blob: fileBlob,
          name: fileName || 'walkthrough.mp4',
          size: fileSize || fileBlob.size,
          type: fileBlob.type || 'video/mp4',
          timestamp: Date.now()
        };
        const r = store.put(item);
        r.onsuccess = () => resolve(true);
        r.onerror = (e) => {
          console.error('IndexedDB put error:', e);
          resolve(false);
        };
      } catch (err) {
        console.error('storeProjectVideo exception:', err);
        resolve(false);
      }
    });
  }

  async function getProjectVideo(projectId) {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_VIDEOS, 'readonly');
        const store = tx.objectStore(STORE_VIDEOS);
        const r = store.get(projectId);
        r.onsuccess = () => resolve(r.result || null);
        r.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async function deleteProjectVideo(projectId) {
    const db = await getDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_VIDEOS, 'readwrite');
        const store = tx.objectStore(STORE_VIDEOS);
        const r = store.delete(projectId);
        r.onsuccess = () => resolve(true);
        r.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // ----------------------------------------------------------------------------
  // 2. CURATED DEFAULT ARCHITECTURAL WORKS (8 PROJECTS)
  // ----------------------------------------------------------------------------
  const DEFAULT_PROJECTS = [
    {
      id: 'proj-01',
      title: 'The Cedar Villa & Pavilion',
      category: 'residential',
      location: 'Hudson Valley Estate',
      year: '2025',
      area: '480 m² (5,160 sq ft)',
      status: 'Built // Completed',
      client: 'Private Residential Commission',
      hasVideo: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoName: 'The_Cedar_Villa_Lumion_Walkthrough.mp4',
      coverImage: 'assets/images/hero_render.jpg',
      galleryImages: [
        'assets/images/hero_render.jpg',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `Designed by MD. Nazir Morsed, The Cedar Villa explores spatial continuity between domestic shelter and natural topography. 

The design employs a board-formed reinforced concrete podium that anchors a lightweight timber-framed pavilion. Expansive floor-to-ceiling structural glazing opens directly toward a 24-meter infinity reflecting pool, creating a seamless visual plane between the living salon and the surrounding landscape.

Spatial planning and sustainable architecture are deeply integrated into the tectonic envelope: a cantilevered cedar canopy mitigates summer solar heat gain while capturing passive solar energy during cold months. Triple-glazed low-emissivity glass assemblies and radiant sub-floor heating minimize overall energy demand.`,
      specs: [
        { label: 'Architect / Lead Designer', value: 'MD. Nazir Morsed, B.Arch' },
        { label: 'Spatial Planning Strategy', value: 'Open-plan social pavilion with private sleeping wings' },
        { label: 'Structural System', value: 'Board-formed concrete podium & Glulam Timber frame' },
        { label: 'Drafting & BIM Detailing', value: 'AutoCAD Working Drawings & Revit BIM LOD 350' },
        { label: 'Visualization Engine', value: 'Lumion 12 Pro Photorealistic Raytracing' },
        { label: 'Energy Performance', value: 'Passive Solar & Cross-Ventilation Architecture' }
      ],
      techStack: ['AutoCAD', 'Revit BIM', 'Lumion', 'SketchUp Pro', 'Rhino 7']
    },
    {
      id: 'proj-02',
      title: 'Komorebi Cultural Pavilion',
      category: 'commercial',
      location: 'Civic Cultural District',
      year: '2024',
      area: '3,200 m² (34,440 sq ft)',
      status: 'Commission 1st Prize // Built',
      client: 'Municipal Cultural & Arts Foundation',
      hasVideo: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoName: 'Komorebi_Daylight_Simulation.mp4',
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `A civic exhibition hall, auditorium, and botanical conservatory conceived around daylight calibration.

The pavilion features an engineered timber diagrid canopy with parametric roof louvers that filter natural southern light into the central public atrium. A central natural ventilation stack draws air across sunken reflection ponds, cooling the public concourse through passive convection without excessive mechanical chillers.

Complete architectural working drawings, structural grid layouts, and detail sections were coordinated in AutoCAD and Revit BIM by MD. Nazir Morsed.`,
      specs: [
        { label: 'Architectural Typology', value: 'Civic Exhibition & Cultural Auditorium' },
        { label: 'Lead Drafter & Designer', value: 'MD. Nazir Morsed, B.Arch' },
        { label: 'Structural Framework', value: 'Timber Diagrid & Steel Hybrid Structure' },
        { label: 'Drafting Documentation', value: 'AutoCAD 2D Working Drawings & Detail Cuts' },
        { label: 'Daylight Performance', value: '82% Daylight Autonomy with passive shading' }
      ],
      techStack: ['AutoCAD', 'Revit BIM', 'Lumion', 'Rhino 7', 'V-Ray']
    },
    {
      id: 'proj-03',
      title: 'Nordic Monolith Coastal Residence',
      category: 'residential',
      location: 'Coastal Escarpment',
      year: '2024',
      area: '360 m² (3,875 sq ft)',
      status: 'Built // Completed',
      client: 'Private Residential Client',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `Conceived as a protective architectural monolith rising from the coastal bedrock, this residence is designed to withstand extreme maritime winds while providing an oasis of domestic calm.

Constructed with pigmented basalt concrete and knot-free timber interior linings, the house features a 6.5-meter cantilevered viewing deck suspended above the coastline. Full architectural drafting and spatial zoning performed by MD. Nazir Morsed.`,
      specs: [
        { label: 'Project Typology', value: 'Custom Single-Family Coastal Residence' },
        { label: 'Architect / Spatial Planner', value: 'MD. Nazir Morsed' },
        { label: 'Exterior Walls', value: 'Pigmented Basalt Concrete with Thermal Break' },
        { label: 'CAD & 3D Workflow', value: 'AutoCAD Detailing & SketchUp 3D Massing' },
        { label: 'Rendering', value: 'Lumion Cinematic Lighting' }
      ],
      techStack: ['AutoCAD', 'SketchUp Pro', 'Lumion', 'Revit']
    },
    {
      id: 'proj-04',
      title: 'The Foundry Creative Headquarters',
      category: 'commercial',
      location: 'Urban Design District',
      year: '2023',
      area: '1,850 m² (19,900 sq ft)',
      status: 'Adaptive Reuse // Built',
      client: 'Creative Studio Consortium',
      coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `Adaptive reuse transformation of an industrial brick foundry into a modern, light-filled collaborative workspace and design atelier.

The heritage brick structure was preserved and retrofitted with high-efficiency glazing, custom steel mezzanines, and acoustic timber ceilings. MD. Nazir Morsed handled the spatial layout optimization, emergency egress circulation planning, and technical CAD drafting packages.`,
      specs: [
        { label: 'Typology', value: 'Industrial Adaptive Reuse & Office Architecture' },
        { label: 'Spatial Planning', value: 'MD. Nazir Morsed, B.Arch' },
        { label: 'Drafting Package', value: 'Detailed MEP Coordination & Architectural Sections' },
        { label: 'Primary Materials', value: 'Restored Industrial Brick, Structural Steel, Oak' }
      ],
      techStack: ['AutoCAD', 'Revit BIM', 'SketchUp', 'Enscape']
    },
    {
      id: 'proj-05',
      title: 'Minimalist Travertine Penthouse',
      category: 'interior',
      location: 'Metropolitan High-Rise',
      year: '2024',
      area: '210 m² (2,260 sq ft)',
      status: 'Completed // Interior Architecture',
      client: 'Private Executive Residence',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `A study in tactile minimalism and refined interior spatial planning.

All functional utilities, HVAC supply diffusers, and storage cabinetry are concealed behind fluted oak wall panels. Monolithic honed Italian travertine is utilized for the bespoke kitchen island and bathroom vanities, creating continuous horizontal stone surfaces that flow across rooms.`,
      specs: [
        { label: 'Interior Architect', value: 'MD. Nazir Morsed' },
        { label: 'Spatial Planning Focus', value: 'Open-concept living with hidden service volumes' },
        { label: 'Stone Finish', value: 'Honed Roman Travertine & Lime Plaster' },
        { label: 'Millwork Drafting', value: '1:10 Detailed Joinery CAD Drawings in AutoCAD' }
      ],
      techStack: ['AutoCAD Joinery', 'SketchUp Pro', 'Lumion', 'V-Ray']
    },
    {
      id: 'proj-06',
      title: 'Voxel Horizon Ecological High-Rise',
      category: 'visualization',
      location: 'Waterfront Urban Core',
      year: '2025',
      area: '48,000 m² (Height: 185m)',
      status: 'Urban 3D Visualization & Simulation',
      client: 'Sustainable Urban Development Group',
      hasVideo: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoName: 'Metropolis_Lumion_3D_Flythrough.mp4',
      coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `A 3D architectural visualization project exploring vertical biophilic architecture and high-density urban sustainability.

The tower massing features stepped garden terraces every six stories, creating natural micro-climates that channel upward air breezes and reduce artificial cooling requirements. Rendered with realistic daylight and environmental atmospherics in Lumion.`,
      specs: [
        { label: 'Lead 3D Visualizer', value: 'MD. Nazir Morsed' },
        { label: 'Visual Software', value: 'Lumion 12 Pro Photorealistic Walkthrough & Stills' },
        { label: '3D Modeling Core', value: 'Revit BIM & SketchUp Pro Parametric Massing' },
        { label: 'Climatic Strategy', value: 'Vertical Sky Gardens & Solar Shading Louvers' }
      ],
      techStack: ['Lumion 12 Pro', 'Revit BIM', 'SketchUp', 'Photoshop']
    },
    {
      id: 'proj-07',
      title: 'The Rammed Earth Garden Villa',
      category: 'residential',
      location: 'Suburban Green Enclave',
      year: '2023',
      area: '520 m² (5,600 sq ft)',
      status: 'Built // Completed',
      client: 'Private Residence Commission',
      coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `Surrounded by lush native vegetation, this residence incorporates 500mm-thick rammed earth load-bearing walls that provide high thermal mass and regulate internal humidity.

The building plan wraps around an inward-facing courtyard rill and reflection pond, creating a quiet, introverted sanctuary with natural cross-ventilation. Designed and drafted by MD. Nazir Morsed.`,
      specs: [
        { label: 'Architect / Designer', value: 'MD. Nazir Morsed, B.Arch' },
        { label: 'Wall Construction', value: 'Stabilized Rammed Earth (500mm thermal mass)' },
        { label: 'Drafting Protocol', value: 'AutoCAD Comprehensive Floor Plans & Structural Details' },
        { label: 'Water Strategy', value: 'Integrated Rainwater Harvesting & Greywater Reuse' }
      ],
      techStack: ['AutoCAD', 'Revit', 'SketchUp', 'Lumion']
    },
    {
      id: 'proj-08',
      title: 'Zen Serenity Pavilion Interior',
      category: 'interior',
      location: 'Private Sanctuary',
      year: '2024',
      area: '95 m² (1,020 sq ft)',
      status: 'Built // Completed',
      client: 'Wellness & Cultural Foundation',
      hasVideo: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoName: 'Zen_Pavilion_Spatial_Tour.mp4',
      coverImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanImage: 'assets/images/architectural_blueprint.jpg',
      description: `A minimalist interior pavilion prioritizing natural acoustic resonance, cedar fragrance, and diffused ambient daylight.

Features traditional mortise-and-tenon joinery details, hand-selected timber, and acoustic fabric panels. All joinery details and dimensional blueprints produced with millimeter accuracy by MD. Nazir Morsed.`,
      specs: [
        { label: 'Designer & Drafter', value: 'MD. Nazir Morsed' },
        { label: 'Timber Species', value: 'Natural Cypress & Sugi Cedar' },
        { label: 'CAD Drawings', value: 'AutoCAD 1:20 Joinery Blueprints' },
        { label: 'Lighting Concept', value: 'Concealed Indirect Circadian Illumination' }
      ],
      techStack: ['AutoCAD', 'SketchUp Pro', 'Lumion', 'Photoshop']
    }
  ];

  // ----------------------------------------------------------------------------
  // 3. APPLICATION STATE
  // ----------------------------------------------------------------------------
  let projects = [];
  let inquiries = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let activeModalProject = null;
  let activeProjectIndex = 0;
  let isAuthenticated = false;

  // Video Upload & Playback State
  let pendingVideoData = null; // { file, name, size, isBlob, url, isUrl, isRemoved }
  let activeModalVideoBlobUrl = null;
  let previewVideoBlobUrl = null;

  // ----------------------------------------------------------------------------
  // 4. INITIALIZATION
  // ----------------------------------------------------------------------------
  function init() {
    loadTheme();
    loadProjects();
    loadInquiries();
    loadAuth();
    setupEventListeners();
    setupClocks();
    setupCurrentYear();
    renderGallery();
    renderAdminTable();
    renderInbox();
    updateCounts();
  }

  // ----------------------------------------------------------------------------
  // 5. THEME MANAGEMENT
  // ----------------------------------------------------------------------------
  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'theme-light';
    document.body.className = savedTheme;
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'theme-light' : 'theme-dark';
    document.body.className = newTheme;
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Architectural theme switched to ${isDark ? 'Light Editorial' : 'Obsidian Dark'}`);
  }

  // ----------------------------------------------------------------------------
  // 6. PROJECTS DATA & PERSISTENCE
  // ----------------------------------------------------------------------------
  function loadProjects() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        projects = JSON.parse(stored);
        if (!Array.isArray(projects) || projects.length === 0) {
          projects = [...DEFAULT_PROJECTS];
          saveProjects();
        }
      } catch (err) {
        console.error('Error parsing stored projects:', err);
        projects = [...DEFAULT_PROJECTS];
        saveProjects();
      }
    } else {
      // Migrate from v2 if available
      const oldV2 = localStorage.getItem('nazir_morsed_projects_v2');
      if (oldV2) {
        try {
          const parsed = JSON.parse(oldV2);
          if (Array.isArray(parsed) && parsed.length > 0) {
            projects = parsed.map(p => {
              const def = DEFAULT_PROJECTS.find(d => d.id === p.id);
              if (def && def.videoUrl && !p.videoUrl) {
                return { ...p, hasVideo: true, videoUrl: def.videoUrl, videoName: def.videoName };
              }
              return p;
            });
            saveProjects();
            return;
          }
        } catch (e) {}
      }
      projects = [...DEFAULT_PROJECTS];
      saveProjects();
    }
  }

  function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function loadInquiries() {
    const stored = localStorage.getItem(INBOX_KEY);
    if (stored) {
      try {
        inquiries = JSON.parse(stored);
        if (!Array.isArray(inquiries)) inquiries = [];
      } catch (e) {
        inquiries = [];
      }
    } else {
      // Seed a welcome sample inquiry for Nazir
      inquiries = [
        {
          id: 'inq-sample-1',
          name: 'Sarah Rahman (Director, Urban Living)',
          email: 'sarah.rahman@urbanliving.com',
          typology: 'Residential (Custom Villa, Residence)',
          location: 'Gulshan, Dhaka',
          message: 'Hello Nazir, we reviewed your portfolio and would like to consult with you on the spatial planning and architectural drafting for a modern 3-story residential villa.',
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ];
      saveInquiries();
    }
  }

  function saveInquiries() {
    localStorage.setItem(INBOX_KEY, JSON.stringify(inquiries));
  }

  // ----------------------------------------------------------------------------
  // 7. AUTHENTICATION & SECURITY
  // ----------------------------------------------------------------------------
  function loadAuth() {
    // Clear legacy persistent localStorage auth tokens to enforce session-only access
    try {
      localStorage.removeItem('nazir_morsed_auth_v2');
      localStorage.removeItem('nazir_morsed_auth');
    } catch (e) {}

    const sessionAuth = sessionStorage.getItem(SESSION_AUTH_KEY);
    isAuthenticated = sessionAuth === 'active';
    updateAuthUI();
  }

  function getMasterPassword() {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  }

  function setMasterPassword(newPwd) {
    localStorage.setItem(PASSWORD_KEY, newPwd);
  }

  function login(usernameOrEmail, password) {
    const master = getMasterPassword();
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Strict validation: username must be non-empty and match secret admin credentials
    const isValidUser = Boolean(cleanUser) && (
      cleanUser === ADMIN_USERNAME.toLowerCase() || 
      cleanUser === ADMIN_EMAIL.toLowerCase()
    );

    const isPasswordValid = Boolean(cleanPass) && cleanPass === master;

    if (isValidUser && isPasswordValid) {
      isAuthenticated = true;
      sessionStorage.setItem(SESSION_AUTH_KEY, 'active');
      updateAuthUI();
      showToast('Admin session unlocked. Welcome, MD. Nazir Morsed.', 'success');
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    try {
      localStorage.removeItem('nazir_morsed_auth_v2');
      localStorage.removeItem('nazir_morsed_auth');
    } catch (e) {}
    updateAuthUI();
    showToast('Signed out of Administrative CMS. Session terminated.');
  }

  function updateAuthUI() {
    const authDot = document.getElementById('auth-indicator-dot');
    const authView = document.getElementById('admin-auth-view');
    const dashView = document.getElementById('admin-dashboard-view');
    const statusBadge = document.getElementById('admin-status-badge');

    if (authDot) {
      authDot.classList.toggle('authenticated', isAuthenticated);
      authDot.title = isAuthenticated ? `Admin Authenticated (${ADMIN_EMAIL})` : 'CMS Locked';
    }

    if (authView && dashView) {
      if (isAuthenticated) {
        authView.style.display = 'none';
        dashView.style.display = 'flex';
        if (statusBadge) statusBadge.textContent = 'LOGGED IN // NAZIR MORSED';
      } else {
        authView.style.display = 'flex';
        dashView.style.display = 'none';
        if (statusBadge) statusBadge.textContent = 'SECURE PORTAL';
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 8. GALLERY RENDERING & FILTERING
  // ----------------------------------------------------------------------------
  function getFilteredProjects() {
    return projects.filter(proj => {
      // Category filter
      const matchesCategory = currentFilter === 'all' || proj.category.toLowerCase() === currentFilter.toLowerCase();
      if (!matchesCategory) return false;

      // Search query filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = proj.title.toLowerCase().includes(q);
      const locMatch = proj.location.toLowerCase().includes(q);
      const catMatch = proj.category.toLowerCase().includes(q);
      const descMatch = proj.description.toLowerCase().includes(q);
      const techMatch = Array.isArray(proj.techStack) && proj.techStack.some(t => t.toLowerCase().includes(q));

      return titleMatch || locMatch || catMatch || descMatch || techMatch;
    });
  }

  function renderGallery() {
    const grid = document.getElementById('projects-grid');
    const noProjectsView = document.getElementById('no-projects-view');
    if (!grid) return;

    const filtered = getFilteredProjects();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (noProjectsView) noProjectsView.style.display = 'block';
      return;
    }

    if (noProjectsView) noProjectsView.style.display = 'none';

    grid.innerHTML = filtered.map((proj, idx) => {
      const indexNumber = String(idx + 1).padStart(2, '0');
      const catName = formatCategoryName(proj.category);
      const snippet = proj.description.split('\n')[0] || '';

      return `
        <article class="project-card" data-id="${proj.id}" tabindex="0" role="button" aria-label="View case study for ${escapeHtml(proj.title)}">
          <div class="card-media">
            <img src="${escapeHtml(proj.coverImage)}" alt="${escapeHtml(proj.title)}" class="card-img" loading="lazy">
            <div class="card-overlay"></div>
            
            <div class="card-badge-top">
              <span class="card-cat-badge">${catName}</span>
              ${(proj.hasVideo || proj.videoUrl) ? '<span class="card-video-pill"><span class="play-dot">▶</span> Walkthrough</span>' : ''}
              <span class="card-index">PROJECT #${indexNumber}</span>
            </div>

            <div class="card-cta-hover">
              <span>View Case Study</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          <div class="card-content">
            <div class="card-title-row">
              <h3 class="card-title">${escapeHtml(proj.title)}</h3>
              <span class="card-year">${escapeHtml(proj.year || '2025')}</span>
            </div>

            <div class="card-location">${escapeHtml(proj.location)}</div>
            <p class="card-desc-snippet">${escapeHtml(snippet)}</p>

            <div class="card-meta-bar">
              <span class="meta-status">${escapeHtml(proj.status || 'Commission')}</span>
              <span class="meta-area">${escapeHtml(proj.area || '')}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click handlers to project cards
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        openCaseStudy(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.dataset.id;
          openCaseStudy(id);
        }
      });
    });
  }

  function updateCounts() {
    const countAll = document.getElementById('count-all');
    const countRes = document.getElementById('count-residential');
    const countCom = document.getElementById('count-commercial');
    const countInt = document.getElementById('count-interior');
    const countVis = document.getElementById('count-visualization');
    const adminTotalCount = document.getElementById('admin-total-count');
    const adminInboxCount = document.getElementById('admin-inbox-count');

    const total = projects.length;
    const res = projects.filter(p => p.category === 'residential').length;
    const com = projects.filter(p => p.category === 'commercial').length;
    const int = projects.filter(p => p.category === 'interior').length;
    const vis = projects.filter(p => p.category === 'visualization').length;

    if (countAll) countAll.textContent = total;
    if (countRes) countRes.textContent = res;
    if (countCom) countCom.textContent = com;
    if (countInt) countInt.textContent = int;
    if (countVis) countVis.textContent = vis;
    if (adminTotalCount) adminTotalCount.textContent = total;
    if (adminInboxCount) adminInboxCount.textContent = inquiries.length;
  }

  // ----------------------------------------------------------------------------
  // 9. CASE STUDY MODAL VIEW
  // ----------------------------------------------------------------------------
  async function openCaseStudy(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    activeModalProject = project;
    activeProjectIndex = projects.findIndex(p => p.id === projectId);

    const modal = document.getElementById('case-study-modal');
    if (!modal) return;

    // Fill project details
    document.getElementById('modal-category').textContent = formatCategoryName(project.category).toUpperCase();
    document.getElementById('modal-proj-id').textContent = `PROJECT #${String(activeProjectIndex + 1).padStart(2, '0')}`;
    document.getElementById('modal-project-title').textContent = project.title;
    document.getElementById('modal-location').textContent = `${project.location} // ${project.year}`;
    
    const heroImg = document.getElementById('modal-hero-img');
    heroImg.src = project.coverImage;
    heroImg.alt = project.title;

    // Narrative text
    const descEl = document.getElementById('modal-description');
    const paragraphs = project.description.split('\n\n').filter(p => p.trim());
    descEl.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');

    // Architectural Video Player Setup
    const videoContainer = document.getElementById('modal-video-container');
    const videoPlayer = document.getElementById('modal-project-video');
    const noVideoPlaceholder = document.getElementById('modal-no-video');
    const videoBadge = document.getElementById('modal-video-badge');
    const videoLead = document.getElementById('modal-video-lead');
    const videoCaption = document.getElementById('modal-video-caption');

    if (activeModalVideoBlobUrl) {
      URL.revokeObjectURL(activeModalVideoBlobUrl);
      activeModalVideoBlobUrl = null;
    }

    // Check IndexedDB for locally uploaded video blob
    const storedVideo = await getProjectVideo(project.id);
    if (storedVideo && storedVideo.blob) {
      activeModalVideoBlobUrl = URL.createObjectURL(storedVideo.blob);
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = activeModalVideoBlobUrl;
        videoPlayer.load();
      }
      if (videoContainer) videoContainer.style.display = 'block';
      if (noVideoPlaceholder) noVideoPlaceholder.style.display = 'none';
      if (videoBadge) videoBadge.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>DIRECT UPLOAD // ${escapeHtml(storedVideo.name)}</span>
      `;
      if (videoLead) videoLead.textContent = `Uploaded File: ${storedVideo.name} (${formatBytes(storedVideo.size)})`;
      if (videoCaption) videoCaption.textContent = `Directly uploaded architectural animation. Stored locally in browser IndexedDB.`;
    } else if (project.videoUrl) {
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = project.videoUrl;
        videoPlayer.load();
      }
      if (videoContainer) videoContainer.style.display = 'block';
      if (noVideoPlaceholder) noVideoPlaceholder.style.display = 'none';
      if (videoBadge) videoBadge.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>LUMION 3D // 60 FPS</span>
      `;
      if (videoLead) videoLead.textContent = `Architectural Simulation // MD. Nazir Morsed (B.Arch)`;
      if (videoCaption) videoCaption.textContent = `High-definition architectural walkthrough illustrating spatial transitions, daylight modulation, and material tectonics.`;
    } else {
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
      }
      if (videoContainer) videoContainer.style.display = 'none';
      if (noVideoPlaceholder) noVideoPlaceholder.style.display = 'block';
    }

    // Gallery images
    const galleryGrid = document.getElementById('modal-gallery-grid');
    const galleryImages = (project.galleryImages && project.galleryImages.length > 0) 
      ? project.galleryImages 
      : [project.coverImage];

    galleryGrid.innerHTML = galleryImages.map((imgUrl, i) => `
      <div class="case-gallery-item" data-img-url="${escapeHtml(imgUrl)}" data-caption="${escapeHtml(project.title)} — Perspective View 0${i + 1}" tabindex="0" role="button" aria-label="Zoom image">
        <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(project.title)} Render ${i + 1}" loading="lazy">
        <div class="gallery-zoom-badge">🔍 Zoom View</div>
      </div>
    `).join('');

    // Lightbox triggers for gallery items
    galleryGrid.querySelectorAll('.case-gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        openLightbox(item.dataset.imgUrl, item.dataset.caption);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openLightbox(item.dataset.imgUrl, item.dataset.caption);
      });
    });

    // Floorplan image
    const floorplanImg = document.getElementById('modal-floorplan-img');
    const planSrc = project.floorPlanImage || 'assets/images/architectural_blueprint.jpg';
    floorplanImg.src = planSrc;
    floorplanImg.onclick = () => openLightbox(planSrc, `${project.title} — Architectural Floor Plan & Detailed Sections`);

    // Specs list
    const specsList = document.getElementById('modal-specs-list');
    const defaultSpecs = [
      { label: 'Architect / Lead Designer', value: 'MD. Nazir Morsed, B.Arch' },
      { label: 'Typology', value: formatCategoryName(project.category) },
      { label: 'Location', value: project.location },
      { label: 'Year Completed', value: project.year },
      { label: 'Gross Area (GIA)', value: project.area || 'N/A' },
      { label: 'Project Status', value: project.status || 'Active' },
      { label: 'Client / Commission', value: project.client || 'Confidential' },
      { label: 'Administrative Contact', value: ADMIN_EMAIL }
    ];

    const projectSpecs = (project.specs && project.specs.length > 0) ? project.specs : defaultSpecs;
    specsList.innerHTML = projectSpecs.map(s => `
      <div class="specs-row">
        <dt>${escapeHtml(s.label)}</dt>
        <dd>${escapeHtml(s.value)}</dd>
      </div>
    `).join('');

    // Tech stack pills
    const techWrap = document.getElementById('modal-tech-stack');
    const tools = project.techStack || ['AutoCAD', 'Revit', 'Lumion', 'SketchUp'];
    techWrap.innerHTML = tools.map(t => `<span class="tech-spec-pill">${escapeHtml(t)}</span>`).join('');

    // Quick admin edit & delete buttons inside case study
    const editBtn = document.getElementById('modal-edit-this-btn');
    const deleteBtn = document.getElementById('modal-delete-this-btn');
    if (editBtn) {
      editBtn.onclick = () => {
        closeCaseStudy();
        openAdminDashboard();
        startEditProject(project.id);
      };
    }
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (confirm(`Are you sure you want to permanently delete "${project.title}" from your portfolio?`)) {
          await deleteProject(project.id);
          closeCaseStudy();
        }
      };
    }

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Scroll body to top
    const modalBody = document.getElementById('case-study-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  function closeCaseStudy() {
    const modal = document.getElementById('case-study-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    const videoPlayer = document.getElementById('modal-project-video');
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
      videoPlayer.src = '';
    }
    if (activeModalVideoBlobUrl) {
      URL.revokeObjectURL(activeModalVideoBlobUrl);
      activeModalVideoBlobUrl = null;
    }
    activeModalProject = null;
  }

  function navigateCaseStudy(direction) {
    if (projects.length === 0) return;
    activeProjectIndex = (activeProjectIndex + direction + projects.length) % projects.length;
    openCaseStudy(projects[activeProjectIndex].id);
  }

  // ----------------------------------------------------------------------------
  // 10. LIGHTBOX (ZOOM INSPECTION)
  // ----------------------------------------------------------------------------
  function openLightbox(imgSrc, captionText) {
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imgSrc;
    if (caption) caption.textContent = captionText || 'Architectural View';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  // ----------------------------------------------------------------------------
  // 11. ADMIN CMS MANAGEMENT (CRUD & REAL-TIME UPDATES)
  // ----------------------------------------------------------------------------
  function openAdminDashboard() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateAuthUI();
  }

  function closeAdminDashboard() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderAdminTable() {
    const tbody = document.getElementById('admin-projects-tbody');
    if (!tbody) return;

    if (projects.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            No projects in database. Click "+ New Project" or "Restore Default Projects" to populate.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = projects.map(proj => `
      <tr data-id="${proj.id}">
        <td>
          <div class="table-proj-cell">
            <img src="${escapeHtml(proj.coverImage)}" alt="thumb" class="table-thumb">
            <div>
              <div class="table-proj-title">${escapeHtml(proj.title)}</div>
              <small style="color:var(--text-muted);">${escapeHtml(proj.client || 'Direct Client')}</small>
            </div>
          </div>
        </td>
        <td>
          <span class="table-cat-badge">${formatCategoryName(proj.category)}</span>
        </td>
        <td>${escapeHtml(proj.location)} <br><small style="color:var(--text-muted);">${escapeHtml(proj.year)}</small></td>
        <td>
          ${(proj.hasVideo || proj.videoUrl)
            ? `<span class="table-video-badge active">🎥 ${escapeHtml(proj.videoName || 'Walkthrough Active')}</span>`
            : `<span class="table-video-badge none">—</span>`}
        </td>
        <td>${escapeHtml(proj.area || '—')}</td>
        <td><span style="font-size:0.8rem; color:var(--status-green);">${escapeHtml(proj.status || 'Published')}</span></td>
        <td class="actions-col">
          <div class="table-actions">
            <button class="btn-outline btn-xs btn-edit-proj" data-id="${proj.id}">Edit</button>
            <button class="btn-danger-outline btn-xs btn-delete-proj" data-id="${proj.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row action listeners
    tbody.querySelectorAll('.btn-edit-proj').forEach(btn => {
      btn.onclick = () => startEditProject(btn.dataset.id);
    });

    tbody.querySelectorAll('.btn-delete-proj').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        const target = projects.find(p => p.id === id);
        if (!target) return;
        if (confirm(`Confirm deletion of "${target.title}"? This change will be immediately reflected on the live site.`)) {
          await deleteProject(id);
        }
      };
    });
  }

  function renderInbox() {
    const container = document.getElementById('admin-inbox-list');
    if (!container) return;

    if (inquiries.length === 0) {
      container.innerHTML = `
        <div class="inbox-empty-state">
          No project inquiries yet. Messages submitted via the contact form will appear here and are routed to <strong>${ADMIN_EMAIL}</strong>.
        </div>
      `;
      return;
    }

    container.innerHTML = inquiries.map(inq => `
      <div class="inbox-item">
        <div class="inbox-item-header">
          <div>
            <span class="inbox-sender-name">${escapeHtml(inq.name)}</span>
            <span class="sep">&bull;</span>
            <a href="mailto:${escapeHtml(inq.email)}" class="inbox-sender-email">${escapeHtml(inq.email)}</a>
          </div>
          <span class="inbox-timestamp">${escapeHtml(inq.timestamp)}</span>
        </div>
        <div style="display:flex; gap: 0.5rem; flex-wrap:wrap;">
          <span class="inbox-badge">${escapeHtml(inq.typology)}</span>
          ${inq.location ? `<span class="inbox-badge">Site: ${escapeHtml(inq.location)}</span>` : ''}
        </div>
        <div class="inbox-message-body">
          ${escapeHtml(inq.message)}
        </div>
      </div>
    `).join('');
  }

  async function deleteProject(projectId) {
    const initialLen = projects.length;
    projects = projects.filter(p => p.id !== projectId);
    if (projects.length < initialLen) {
      await deleteProjectVideo(projectId);
      saveProjects();
      renderGallery();
      renderAdminTable();
      updateCounts();
      showToast('Project permanently removed from portfolio grid.', 'success');
    }
  }

  async function startEditProject(projectId) {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    // Switch to Form Tab
    switchAdminTab('form-tab');

    // Populate Form Fields
    document.getElementById('edit-project-id').value = proj.id;
    document.getElementById('form-heading').textContent = `Edit Project: ${proj.title}`;
    document.getElementById('cms-btn-text').textContent = 'Update & Publish Changes';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';

    document.getElementById('cms-title').value = proj.title || '';
    document.getElementById('cms-category').value = proj.category || 'residential';
    document.getElementById('cms-location').value = proj.location || '';
    document.getElementById('cms-year').value = proj.year || '';
    document.getElementById('cms-area').value = proj.area || '';
    document.getElementById('cms-status').value = proj.status || '';
    document.getElementById('cms-client').value = proj.client || '';
    document.getElementById('cms-description').value = proj.description || '';

    // Specs format
    if (proj.specs && Array.isArray(proj.specs)) {
      document.getElementById('cms-specs').value = proj.specs.map(s => `${s.label}: ${s.value}`).join('\n');
    } else {
      document.getElementById('cms-specs').value = '';
    }

    // Tech Stack
    if (proj.techStack && Array.isArray(proj.techStack)) {
      document.getElementById('cms-tech').value = proj.techStack.join(', ');
    } else {
      document.getElementById('cms-tech').value = '';
    }

    // Cover image preview
    document.getElementById('cms-cover-url').value = proj.coverImage || '';
    setCoverPreview(proj.coverImage);

    // Gallery URLs
    if (proj.galleryImages && Array.isArray(proj.galleryImages)) {
      document.getElementById('cms-gallery-urls').value = proj.galleryImages.join('\n');
      renderGalleryUrlPreviews(proj.galleryImages);
    } else {
      document.getElementById('cms-gallery-urls').value = '';
      renderGalleryUrlPreviews([]);
    }

    // Floor plan
    document.getElementById('cms-plan-url').value = proj.floorPlanImage || '';
    const planPrev = document.getElementById('cms-plan-preview');
    if (planPrev && proj.floorPlanImage) planPrev.src = proj.floorPlanImage;

    // Video Population & Preview
    if (previewVideoBlobUrl) {
      URL.revokeObjectURL(previewVideoBlobUrl);
      previewVideoBlobUrl = null;
    }
    const prevWrap = document.getElementById('cms-video-preview-wrap');
    const prevPlayer = document.getElementById('cms-video-preview-player');
    const prevFilename = document.getElementById('cms-video-filename');
    const prevFilesize = document.getElementById('cms-video-filesize');
    const videoUrlInput = document.getElementById('cms-video-url');
    const videoFileInput = document.getElementById('cms-video-file');
    if (videoFileInput) videoFileInput.value = '';

    // Check IndexedDB first for local binary blob
    const storedVideo = await getProjectVideo(proj.id);
    if (storedVideo && storedVideo.blob) {
      previewVideoBlobUrl = URL.createObjectURL(storedVideo.blob);
      if (prevPlayer) {
        prevPlayer.pause();
        prevPlayer.src = previewVideoBlobUrl;
        prevPlayer.load();
      }
      if (prevFilename) prevFilename.textContent = storedVideo.name;
      if (prevFilesize) prevFilesize.textContent = formatBytes(storedVideo.size);
      if (prevWrap) prevWrap.style.display = 'block';
      if (videoUrlInput) videoUrlInput.value = '';
      pendingVideoData = { type: 'keep_existing', isStored: true };
    } else if (proj.videoUrl) {
      if (prevPlayer) {
        prevPlayer.pause();
        prevPlayer.src = proj.videoUrl;
        prevPlayer.load();
      }
      if (prevFilename) prevFilename.textContent = proj.videoName || 'Walkthrough Video';
      if (prevFilesize) prevFilesize.textContent = 'Remote Video Stream';
      if (prevWrap) prevWrap.style.display = 'block';
      if (videoUrlInput) videoUrlInput.value = proj.videoUrl;
      pendingVideoData = { type: 'keep_existing', isUrl: true, url: proj.videoUrl, name: proj.videoName };
    } else {
      if (prevPlayer) {
        prevPlayer.pause();
        prevPlayer.src = '';
      }
      if (prevWrap) prevWrap.style.display = 'none';
      if (videoUrlInput) videoUrlInput.value = '';
      pendingVideoData = null;
    }
  }

  function resetProjectForm() {
    document.getElementById('project-cms-form').reset();
    document.getElementById('edit-project-id').value = '';
    document.getElementById('form-heading').textContent = 'Add New Architectural Work';
    document.getElementById('cms-btn-text').textContent = 'Publish to Live Portfolio';
    document.getElementById('cancel-edit-btn').style.display = 'none';

    // Clear previews
    setCoverPreview('');
    renderGalleryUrlPreviews([]);
    const planPrev = document.getElementById('cms-plan-preview');
    if (planPrev) planPrev.src = 'assets/images/architectural_blueprint.jpg';

    // Reset video state & preview
    if (previewVideoBlobUrl) {
      URL.revokeObjectURL(previewVideoBlobUrl);
      previewVideoBlobUrl = null;
    }
    const prevWrap = document.getElementById('cms-video-preview-wrap');
    const prevPlayer = document.getElementById('cms-video-preview-player');
    const videoUrlInput = document.getElementById('cms-video-url');
    const videoFileInput = document.getElementById('cms-video-file');

    if (prevPlayer) {
      prevPlayer.pause();
      prevPlayer.src = '';
    }
    if (videoUrlInput) videoUrlInput.value = '';
    if (videoFileInput) videoFileInput.value = '';
    if (prevWrap) prevWrap.style.display = 'none';
    pendingVideoData = null;
  }

  async function handleSaveProject(e) {
    e.preventDefault();

    const editId = document.getElementById('edit-project-id').value.trim();
    const title = document.getElementById('cms-title').value.trim();
    const category = document.getElementById('cms-category').value;
    const location = document.getElementById('cms-location').value.trim();
    const year = document.getElementById('cms-year').value.trim() || String(new Date().getFullYear());
    const area = document.getElementById('cms-area').value.trim();
    const status = document.getElementById('cms-status').value.trim() || 'Built // Completed';
    const client = document.getElementById('cms-client').value.trim() || 'Direct Client';
    const description = document.getElementById('cms-description').value.trim();

    // Validation
    let hasError = false;
    if (!title) {
      document.getElementById('err-cms-title').textContent = 'Project title is required.';
      hasError = true;
    } else {
      document.getElementById('err-cms-title').textContent = '';
    }

    if (!location) {
      document.getElementById('err-cms-location').textContent = 'Location is required.';
      hasError = true;
    } else {
      document.getElementById('err-cms-location').textContent = '';
    }

    if (!description) {
      document.getElementById('err-cms-desc').textContent = 'Concept narrative description is required.';
      hasError = true;
    } else {
      document.getElementById('err-cms-desc').textContent = '';
    }

    // Cover image check
    const coverUrlInput = document.getElementById('cms-cover-url').value.trim();
    const previewImg = document.getElementById('cms-cover-preview');
    const coverImage = coverUrlInput || (previewImg.src && previewImg.style.display !== 'none' ? previewImg.src : '') || 'assets/images/hero_render.jpg';

    if (!coverImage) {
      document.getElementById('err-cms-cover').textContent = 'A cover image render or URL is required.';
      hasError = true;
    } else {
      document.getElementById('err-cms-cover').textContent = '';
    }

    if (hasError) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    // Parse Specs
    const specsRaw = document.getElementById('cms-specs').value.trim();
    const specs = specsRaw.split('\n')
      .map(line => line.trim())
      .filter(line => line.includes(':'))
      .map(line => {
        const parts = line.split(':');
        return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
      });

    // Parse Tech Stack
    const techRaw = document.getElementById('cms-tech').value.trim();
    const techStack = techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : ['AutoCAD', 'Revit', 'Lumion', 'SketchUp'];

    // Parse Gallery Images
    const galleryRaw = document.getElementById('cms-gallery-urls').value.trim();
    let galleryImages = galleryRaw.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
    if (galleryImages.length === 0) {
      galleryImages = [coverImage];
    }

    // Floor plan
    const planUrl = document.getElementById('cms-plan-url').value.trim() || 'assets/images/architectural_blueprint.jpg';

    // Video persistence handling
    const rawVideoUrl = (document.getElementById('cms-video-url')?.value || '').trim();
    const targetId = editId || ('proj-' + Date.now().toString(36));

    let projectHasVideo = false;
    let projectVideoUrl = '';
    let projectVideoName = '';

    if (pendingVideoData && pendingVideoData.isNewFile) {
      // Store local video file into browser IndexedDB
      await storeProjectVideo(targetId, pendingVideoData.file, pendingVideoData.name, pendingVideoData.size);
      projectHasVideo = true;
      projectVideoName = pendingVideoData.name;
      projectVideoUrl = '';
    } else if (pendingVideoData && pendingVideoData.isNewUrl) {
      // Delete any previous local file in IndexedDB
      await deleteProjectVideo(targetId);
      projectHasVideo = true;
      projectVideoUrl = pendingVideoData.url;
      projectVideoName = pendingVideoData.name || 'Walkthrough Video';
    } else if (pendingVideoData && pendingVideoData.isRemoved) {
      await deleteProjectVideo(targetId);
      projectHasVideo = false;
      projectVideoUrl = '';
      projectVideoName = '';
    } else if (pendingVideoData && pendingVideoData.type === 'keep_existing') {
      if (editId) {
        const existing = projects.find(p => p.id === editId);
        if (existing) {
          projectHasVideo = existing.hasVideo || false;
          projectVideoUrl = existing.videoUrl || '';
          projectVideoName = existing.videoName || '';
        }
      }
    } else if (rawVideoUrl) {
      projectHasVideo = true;
      projectVideoUrl = rawVideoUrl;
      projectVideoName = rawVideoUrl.split('/').pop().split('?')[0] || 'Walkthrough Video';
    }

    if (editId) {
      // Edit existing
      const existingIdx = projects.findIndex(p => p.id === editId);
      if (existingIdx !== -1) {
        projects[existingIdx] = {
          ...projects[existingIdx],
          title,
          category,
          location,
          year,
          area,
          status,
          client,
          description,
          coverImage,
          galleryImages,
          floorPlanImage: planUrl,
          hasVideo: projectHasVideo,
          videoUrl: projectVideoUrl,
          videoName: projectVideoName,
          specs: specs.length > 0 ? specs : projects[existingIdx].specs,
          techStack
        };
        showToast(`Project "${title}" updated successfully!`, 'success');
      }
    } else {
      // Create new
      const newProject = {
        id: targetId,
        title,
        category,
        location,
        year,
        area,
        status,
        client,
        description,
        coverImage,
        galleryImages,
        floorPlanImage: planUrl,
        hasVideo: projectHasVideo,
        videoUrl: projectVideoUrl,
        videoName: projectVideoName,
        specs: specs.length > 0 ? specs : [
          { label: 'Architect / Lead Designer', value: 'MD. Nazir Morsed, B.Arch' },
          { label: 'Typology', value: formatCategoryName(category) },
          { label: 'Location', value: location },
          { label: 'Year Completed', value: year },
          { label: 'Gross Area', value: area || 'Custom' },
          { label: 'Administrative Contact', value: ADMIN_EMAIL }
        ],
        techStack
      };
      projects.unshift(newProject);
      showToast(`New project "${title}" published instantly to live portfolio!`, 'success');
    }

    saveProjects();
    renderGallery();
    renderAdminTable();
    updateCounts();

    // Reset and return to manage tab
    resetProjectForm();
    switchAdminTab('manage-tab');
  }

  function setCoverPreview(src) {
    const preview = document.getElementById('cms-cover-preview');
    const placeholder = document.getElementById('cover-placeholder');
    if (!preview || !placeholder) return;

    if (src) {
      preview.src = src;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      preview.src = '';
      preview.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }

  function renderGalleryUrlPreviews(urls) {
    const container = document.getElementById('gallery-previews-container');
    if (!container) return;
    container.innerHTML = urls.map(url => `
      <div class="gallery-preview-item">
        <img src="${escapeHtml(url)}" alt="Preview">
      </div>
    `).join('');
  }

  function switchAdminTab(targetTabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === targetTabId);
    });
    document.querySelectorAll('.admin-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === targetTabId);
    });
  }

  // ----------------------------------------------------------------------------
  // 12. DATA BACKUP & RESTORE
  // ----------------------------------------------------------------------------
  function exportProjectsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `nazir_morsed_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Portfolio JSON archive downloaded.', 'success');
  }

  function importProjectsJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          projects = imported;
          saveProjects();
          renderGallery();
          renderAdminTable();
          updateCounts();
          showToast(`Successfully imported ${imported.length} architectural projects.`, 'success');
        } else {
          showToast('Invalid JSON structure: Expected an array of projects.', 'error');
        }
      } catch (err) {
        showToast('Error parsing JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  }

  function restoreDefaultProjects() {
    if (confirm('Restore the 8 curated showcase architectural projects? This will replace current items with default works.')) {
      projects = [...DEFAULT_PROJECTS];
      saveProjects();
      renderGallery();
      renderAdminTable();
      updateCounts();
      showToast('Restored 8 default demonstration projects for MD. Nazir Morsed.', 'success');
    }
  }

  // ----------------------------------------------------------------------------
  // 13. CLOCKS & LIVE UTILITIES
  // ----------------------------------------------------------------------------
  function setupClocks() {
    function update() {
      const now = new Date();
      const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const clockLocal = document.getElementById('clock-local');
      if (clockLocal) clockLocal.textContent = localTime;
    }

    update();
    setInterval(update, 60000);
  }

  function setupCurrentYear() {
    const yr = document.getElementById('current-year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">⟡</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOutToast 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ----------------------------------------------------------------------------
  // 14. EVENT LISTENERS
  // ----------------------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu on link click
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Category Tabs Filter
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentFilter = tab.dataset.category;
        renderGallery();
      });
    });

    // Project Search Input
    const searchInput = document.getElementById('project-search');
    const clearSearchBtn = document.getElementById('search-clear-btn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'inline-block' : 'none';
        }
        renderGallery();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderGallery();
      });
    }

    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        currentFilter = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        document.querySelectorAll('.filter-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.category === 'all');
        });
        renderGallery();
      });
    }

    // Modal Close buttons
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('case-study-backdrop');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeCaseStudy);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeCaseStudy);

    // Modal Prev / Next buttons
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateCaseStudy(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateCaseStudy(1));

    // Lightbox Close
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    // Global Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox && lightbox.classList.contains('active')) {
          closeLightbox();
          return;
        }
        const caseStudy = document.getElementById('case-study-modal');
        if (caseStudy && caseStudy.classList.contains('active')) {
          closeCaseStudy();
          return;
        }
        const adminModal = document.getElementById('admin-modal');
        if (adminModal && adminModal.classList.contains('active')) {
          closeAdminDashboard();
          return;
        }
      }

      if (activeModalProject) {
        if (e.key === 'ArrowLeft') navigateCaseStudy(-1);
        if (e.key === 'ArrowRight') navigateCaseStudy(1);
      }
    });

    // Admin Dashboard triggers
    const openAdminBtn = document.getElementById('open-admin-btn');
    const footerAdminLink = document.getElementById('footer-admin-link');
    const footerAddProjLink = document.getElementById('footer-add-project-link');
    const quickAddBtn = document.getElementById('quick-add-project-btn');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const adminBackdrop = document.getElementById('admin-backdrop');

    if (openAdminBtn) openAdminBtn.addEventListener('click', openAdminDashboard);
    if (footerAdminLink) footerAdminLink.addEventListener('click', (e) => { e.preventDefault(); openAdminDashboard(); });
    if (footerAddProjLink) footerAddProjLink.addEventListener('click', (e) => { 
      e.preventDefault(); 
      openAdminDashboard();
      if (isAuthenticated) switchAdminTab('form-tab');
    });
    if (quickAddBtn) quickAddBtn.addEventListener('click', () => {
      openAdminDashboard();
      if (isAuthenticated) switchAdminTab('form-tab');
    });
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminDashboard);
    if (adminBackdrop) adminBackdrop.addEventListener('click', closeAdminDashboard);

    // Admin Login Form
    const loginForm = document.getElementById('admin-login-form');
    const usernameInput = document.getElementById('admin-username-input');
    const passwordInput = document.getElementById('admin-password');
    const authErrorMsg = document.getElementById('auth-error-msg');
    const togglePwdBtn = document.getElementById('toggle-pwd-visibility');

    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
      });
    }

    if (loginForm && passwordInput) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredUser = usernameInput ? usernameInput.value.trim() : '';
        const enteredPass = passwordInput.value;

        if (!enteredUser || !enteredPass) {
          if (authErrorMsg) authErrorMsg.textContent = 'Please provide both username and password.';
          return;
        }

        if (login(enteredUser, enteredPass)) {
          if (authErrorMsg) authErrorMsg.textContent = '';
          if (usernameInput) usernameInput.value = '';
          passwordInput.value = '';
        } else {
          if (authErrorMsg) authErrorMsg.textContent = 'Access denied. Invalid administrative credentials.';
          passwordInput.value = '';
          passwordInput.focus();
        }
      });
    }

    // Admin Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Admin Subnav Tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchAdminTab(tab.dataset.tab);
      });
    });

    const createNewBtn = document.getElementById('tab-create-new-btn');
    if (createNewBtn) {
      createNewBtn.addEventListener('click', () => {
        resetProjectForm();
        switchAdminTab('form-tab');
      });
    }

    // Clear Inbox
    const clearInboxBtn = document.getElementById('clear-inbox-btn');
    if (clearInboxBtn) {
      clearInboxBtn.addEventListener('click', () => {
        if (confirm('Clear all received inquiries in the local archive?')) {
          inquiries = [];
          saveInquiries();
          renderInbox();
          updateCounts();
          showToast('Inquiries inbox cleared.');
        }
      });
    }

    // CMS Project Form
    const cmsForm = document.getElementById('project-cms-form');
    if (cmsForm) cmsForm.addEventListener('submit', handleSaveProject);

    const resetFormBtn = document.getElementById('cms-reset-form-btn');
    if (resetFormBtn) resetFormBtn.addEventListener('click', resetProjectForm);

    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        resetProjectForm();
        switchAdminTab('manage-tab');
      });
    }

    // Cover File Upload (converts to DataURL)
    const coverFileInput = document.getElementById('cms-cover-file');
    if (coverFileInput) {
      coverFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            setCoverPreview(re.target.result);
            document.getElementById('cms-cover-url').value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Cover URL input change
    const coverUrlInput = document.getElementById('cms-cover-url');
    if (coverUrlInput) {
      coverUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        setCoverPreview(val);
      });
    }

    // Preset Render buttons
    document.querySelectorAll('.preset-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let presetSrc = btn.dataset.preset;
        if (presetSrc === 'hero') presetSrc = 'assets/images/hero_render.jpg';
        document.getElementById('cms-cover-url').value = presetSrc;
        setCoverPreview(presetSrc);
        showToast('Preset architectural render selected as cover.');
      });
    });

    // Gallery Files Upload
    const galleryFilesInput = document.getElementById('cms-gallery-files');
    if (galleryFilesInput) {
      galleryFilesInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        let processed = 0;
        const newUrls = [];
        files.forEach(f => {
          const r = new FileReader();
          r.onload = (evt) => {
            newUrls.push(evt.target.result);
            processed++;
            if (processed === files.length) {
              const currentVal = document.getElementById('cms-gallery-urls').value;
              const combined = currentVal ? currentVal + '\n' + newUrls.join('\n') : newUrls.join('\n');
              document.getElementById('cms-gallery-urls').value = combined;
              renderGalleryUrlPreviews(combined.split(/[\n,]+/).map(s => s.trim()).filter(Boolean));
              showToast(`Added ${files.length} uploaded gallery view(s).`);
            }
          };
          r.readAsDataURL(f);
        });
      });
    }

    // Gallery URL Textarea input
    const galleryUrlsInput = document.getElementById('cms-gallery-urls');
    if (galleryUrlsInput) {
      galleryUrlsInput.addEventListener('input', (e) => {
        const urls = e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        renderGalleryUrlPreviews(urls);
      });
    }

    // Floor plan file input
    const planFileInput = document.getElementById('cms-plan-file');
    if (planFileInput) {
      planFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            const planPrev = document.getElementById('cms-plan-preview');
            if (planPrev) planPrev.src = re.target.result;
            document.getElementById('cms-plan-url').value = re.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Video File Direct Upload (<input type="file" accept="video/*">)
    const videoFileInput = document.getElementById('cms-video-file');
    if (videoFileInput) {
      videoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (previewVideoBlobUrl) {
          URL.revokeObjectURL(previewVideoBlobUrl);
          previewVideoBlobUrl = null;
        }

        previewVideoBlobUrl = URL.createObjectURL(file);
        pendingVideoData = {
          isNewFile: true,
          file: file,
          name: file.name,
          size: file.size,
          type: file.type || 'video/mp4'
        };

        const previewPlayer = document.getElementById('cms-video-preview-player');
        const previewWrap = document.getElementById('cms-video-preview-wrap');
        const fileNameEl = document.getElementById('cms-video-filename');
        const fileSizeEl = document.getElementById('cms-video-filesize');
        const urlInput = document.getElementById('cms-video-url');

        if (urlInput) urlInput.value = '';
        if (previewPlayer) {
          previewPlayer.pause();
          previewPlayer.src = previewVideoBlobUrl;
          previewPlayer.load();
        }
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileSizeEl) fileSizeEl.textContent = formatBytes(file.size);
        if (previewWrap) previewWrap.style.display = 'block';

        showToast(`Video loaded: "${file.name}" (${formatBytes(file.size)}). Ready to publish.`, 'success');
      });
    }

    // Video Streaming URL input
    const videoUrlInput = document.getElementById('cms-video-url');
    if (videoUrlInput) {
      videoUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const previewPlayer = document.getElementById('cms-video-preview-player');
        const previewWrap = document.getElementById('cms-video-preview-wrap');
        const fileNameEl = document.getElementById('cms-video-filename');
        const fileSizeEl = document.getElementById('cms-video-filesize');

        if (url) {
          if (previewVideoBlobUrl) {
            URL.revokeObjectURL(previewVideoBlobUrl);
            previewVideoBlobUrl = null;
          }
          const inferredName = url.split('/').pop().split('?')[0] || 'Walkthrough Video';
          pendingVideoData = {
            isNewUrl: true,
            url: url,
            name: inferredName
          };
          if (previewPlayer) {
            previewPlayer.pause();
            previewPlayer.src = url;
            previewPlayer.load();
          }
          if (fileNameEl) fileNameEl.textContent = inferredName;
          if (fileSizeEl) fileSizeEl.textContent = 'Remote Video Stream';
          if (previewWrap) previewWrap.style.display = 'block';
        } else if (pendingVideoData && (pendingVideoData.isNewUrl || pendingVideoData.type === 'keep_existing')) {
          if (previewPlayer) {
            previewPlayer.pause();
            previewPlayer.src = '';
          }
          if (previewWrap) previewWrap.style.display = 'none';
          pendingVideoData = { isRemoved: true };
        }
      });
    }

    // Remove Attached Video Button
    const removeVideoBtn = document.getElementById('cms-remove-video-btn');
    if (removeVideoBtn) {
      removeVideoBtn.addEventListener('click', () => {
        if (previewVideoBlobUrl) {
          URL.revokeObjectURL(previewVideoBlobUrl);
          previewVideoBlobUrl = null;
        }
        const previewPlayer = document.getElementById('cms-video-preview-player');
        const previewWrap = document.getElementById('cms-video-preview-wrap');
        const fileInput = document.getElementById('cms-video-file');
        const urlInput = document.getElementById('cms-video-url');

        if (previewPlayer) {
          previewPlayer.pause();
          previewPlayer.src = '';
        }
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
        if (previewWrap) previewWrap.style.display = 'none';

        pendingVideoData = { isRemoved: true };
        showToast('Video attachment removed from project.');
      });
    }

    // Sample Video Walkthrough Presets
    document.querySelectorAll('.btn-video-sample').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleUrl = btn.dataset.sampleVideo;
        const urlInput = document.getElementById('cms-video-url');
        const fileInput = document.getElementById('cms-video-file');
        if (fileInput) fileInput.value = '';
        if (urlInput) {
          urlInput.value = sampleUrl;
          urlInput.dispatchEvent(new Event('input'));
        }
        showToast('Sample walkthrough attached for testing.');
      });
    });

    // Quick Tech Picker buttons
    document.querySelectorAll('.btn-tag-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const tech = btn.dataset.addTech;
        const input = document.getElementById('cms-tech');
        if (!input) return;
        const current = input.value.split(',').map(s => s.trim()).filter(Boolean);
        if (!current.includes(tech)) {
          current.push(tech);
          input.value = current.join(', ');
        }
      });
    });

    // Backup & Restore buttons
    const exportBtn = document.getElementById('export-json-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportProjectsJSON);

    const importInput = document.getElementById('import-json-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
          importProjectsJSON(e.target.files[0]);
        }
      });
    }

    const restoreBtn = document.getElementById('restore-defaults-btn');
    if (restoreBtn) restoreBtn.addEventListener('click', restoreDefaultProjects);

    const footerResetData = document.getElementById('footer-reset-data');
    if (footerResetData) footerResetData.addEventListener('click', (e) => {
      e.preventDefault();
      restoreDefaultProjects();
    });

    // Change Master Password
    const changePwdForm = document.getElementById('change-password-form');
    if (changePwdForm) {
      changePwdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPwd = document.getElementById('new-master-password').value.trim();
        if (newPwd.length < 6) {
          showToast('Password must be at least 6 characters.', 'error');
          return;
        }
        setMasterPassword(newPwd);
        document.getElementById('new-master-password').value = '';
        showToast('Administrative password updated successfully.', 'success');
      });
    }

    // Contact Form Submission & Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const typology = document.getElementById('contact-typology').value;
        const location = document.getElementById('contact-location').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        let hasError = false;

        if (!name) {
          document.getElementById('err-name').textContent = 'Please enter your name or client firm.';
          hasError = true;
        } else {
          document.getElementById('err-name').textContent = '';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          document.getElementById('err-email').textContent = 'Please provide a valid email address.';
          hasError = true;
        } else {
          document.getElementById('err-email').textContent = '';
        }

        if (!typology) {
          document.getElementById('err-typology').textContent = 'Please select a commission category.';
          hasError = true;
        } else {
          document.getElementById('err-typology').textContent = '';
        }

        if (!message) {
          document.getElementById('err-message').textContent = 'Please describe your spatial requirements or drafting scope.';
          hasError = true;
        } else {
          document.getElementById('err-message').textContent = '';
        }

        if (hasError) return;

        // Save into Inquiries inbox
        const newInquiry = {
          id: 'inq-' + Date.now().toString(36),
          name,
          email,
          typology,
          location,
          message,
          timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        inquiries.unshift(newInquiry);
        saveInquiries();
        renderInbox();
        updateCounts();

        // Simulate successful transmission
        const submitBtn = document.getElementById('contact-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting Brief to Nazir...</span>';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Send Inquiry Brief</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          `;
          showToast(`Inquiry sent to ${ADMIN_EMAIL}. MD. Nazir Morsed will respond within 24 hours.`, 'success');
        }, 1200);
      });
    }

    // CV Download Folio
    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
      downloadCvBtn.addEventListener('click', () => {
        showToast('Initiating download: MD_Nazir_Morsed_Architectural_Portfolio_Dossier.pdf', 'info');
        // Create sample dossier blob
        const folioContent = `
========================================================================
MD. NAZIR MORSED | ARCHITECTURAL DESIGNER / ARCHITECT
Selected Works, Spatial Planning & Technical Drafting Dossier
Primary Administrative Contact: nazirmorsed722@gmail.com
Degree: Bachelor of Architecture (B.Arch)
========================================================================

PROFESSIONAL SUMMARY:
Architectural Designer and Architect specializing in spatial planning, sustainable architecture, architectural drafting, and 3D visual communication. Expert in transforming conceptual briefs into buildable construction documentation sets and photorealistic presentations.

CORE TECHNICAL SKILLS & SOFTWARE:
- AutoCAD: Precision 2D working drawings, floor plans, sections, elevation cuts, detail joinery, municipal approval packages.
- Revit Architecture / BIM: Building Information Modeling, parametric detailing, LOD 350 coordination.
- SketchUp Pro: Rapid 3D spatial massing, volume studies, daylight exploration.
- Lumion: Photorealistic environmental renders, atmospheric lighting, cinematic walkthrough animations.
- Rhino 7 & V-Ray: Parametric surface studies, physical lighting raytracing.

KEY SELECTED WORKS:
1. The Cedar Villa & Pavilion — 480 m² Residential Sanctuary
2. Komorebi Cultural Pavilion — 3,200 m² Civic Diagrid Structure
3. Nordic Monolith Coastal Residence — 360 m² Concrete & Fjord Cantilever
4. The Foundry Creative Headquarters — 1,850 m² Adaptive Reuse
5. Minimalist Travertine Penthouse — 210 m² Interior Architecture
6. Voxel Horizon Ecological High-Rise — 48,000 m² 3D Simulation

DIRECT CONTACT & COMMISSIONS:
Email: nazirmorsed722@gmail.com
Portfolio CMS: Access via Studio CMS on live site.
========================================================================
        `.trim();

        const blob = new Blob([folioContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MD_Nazir_Morsed_Architecture_Dossier_2026.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }

    // Active Navigation Scrollspy
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navItem = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('active'));
          if (navItem) navItem.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ----------------------------------------------------------------------------
  // 15. HELPER FUNCTIONS
  // ----------------------------------------------------------------------------
  function formatCategoryName(cat) {
    if (!cat) return 'Architectural';
    switch (cat.toLowerCase()) {
      case 'residential': return 'Residential';
      case 'commercial': return 'Commercial';
      case 'interior': return 'Interior Design';
      case 'visualization': return '3D Visualizations';
      default: return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ----------------------------------------------------------------------------
  // RUN ON DOM READY
  // ----------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
