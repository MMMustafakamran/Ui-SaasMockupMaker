const path = require('path');

// === GLOBAL CONFIGURATION ===
// Change your background gradient here, and it will apply to all 4 mockup styles automatically!
//
// SOME GOOD-LOOKING NEUTRAL & PREMIUM GRADIENTS TO TRY:
// 1. Dark Sleek (Default) : 'linear-gradient(135deg, #1e1e24 0%, #111115 100%)'
// 2. Muted Sage Green     : 'linear-gradient(135deg, #dce1d8 0%, #c8cdc4 100%)'
// 3. Soft Silver/Grey     : 'linear-gradient(135deg, #e2e2e2 0%, #cfcfcf 100%)'
// 4. Warm Sand            : 'linear-gradient(135deg, #e6ded5 0%, #d5cabd 100%)'
// 5. Pure Minimalist White: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
// 6. Deep Midnight Blue   : 'linear-gradient(135deg, #1a1b26 0%, #11111a 100%)'
// 7. Lavender Mist        : 'linear-gradient(135deg, #e4e4f9 0%, #d4d4f2 100%)'
// 8. Dusty Rose           : 'linear-gradient(135deg, #eedbcf 0%, #d8c2b7 100%)'
// 9. Cyberpunk Neon Dark  : 'linear-gradient(135deg, #09090b 0%, #1a0b2e 100%)'
// 10. Ocean Breeze        : 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'
// 11. Tech Blue (Modern)  : 'linear-gradient(135deg, #0a192f 0%, #112240 100%)'
// 12. Soft Peach & Ice    : 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)'
// 13. High-End Graphite   : 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)'
// 14. Smooth Matte Black  : '#121212'
// 15. Transparent Output  : 'transparent'
// =====================

module.exports = {
    BACKGROUND_GRADIENT: 'linear-gradient(135deg, #e3e4e6 0%, #f4f5f7 100%)', // Default light silver
    
    // Directory paths
    INPUT_DIR: path.join(__dirname, 'input'),
    OUTPUT_DIR: path.join(__dirname, 'output')
};
