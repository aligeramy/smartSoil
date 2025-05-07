const fs = require('fs');
const path = require('path');

// List of HTML files
const distDir = path.join(__dirname, '../dist');
const htmlFiles = [];

// Function to walk through the directory
function walkSync(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkSync(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all HTML files
const files = walkSync(distDir);

// Icon font CSS URLs
const iconFontLinks = `
  <!-- Inject icon font CSS links -->
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Ionicons.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialIcons.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialCommunityIcons.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Feather.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Entypo.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/AntDesign.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Brands.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Regular.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Solid.css" rel="stylesheet">
  
  <!-- Responsive design styles -->
  <style>
    /* Global responsive styles */
    body {
      margin: 0;
      padding: 0;
      background-color: #063B1D;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: white;
    }

    /* Center content on larger screens */
    @media (min-width: 768px) {
      body {
        overflow-x: hidden;
        font-size: 16px;
      }
      
      #root {
        display: flex;
        justify-content: center;
      }
      
      /* Max width container for tablet */
      .max-width-container {
        max-width: 1024px;
        margin: 0 auto;
        height: 100%;
      }
    }
    
    /* Desktop specific styles */
    @media (min-width: 1024px) {
      body {
        font-size: 18px;
      }
      
      /* Max width container for desktop */
      .desktop-container {
        max-width: 1200px;
        margin: 0 auto;
      }
    }
    
    /* Fix for iOS scrolling */
    .scrollable-content {
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      height: 100%;
    }
    
    /* Fix for modal overlays */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  </style>
`;

console.log(`Found ${files.length} HTML files to process`);

// Process each HTML file
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the file already has the icon font links
    if (!content.includes("cdn.jsdelivr.net/npm/@expo/vector-icons")) {
      // Insert the icon font links before the closing </head> tag
      content = content.replace('</head>', `${iconFontLinks}\n</head>`);
      
      // Write the updated content back to the file
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Skipped ${file} (already has icon fonts)`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Web font injection completed!');

// Create a fonts directory if it doesn't exist
const fontsDir = path.join(distDir, '_expo/static/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log(`Created fonts directory at ${fontsDir}`);
}

console.log('All done!'); 