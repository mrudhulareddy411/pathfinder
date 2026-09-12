const fs = require('fs');

function getMatchingBraceEnd(str, startIdx) {
    let count = 0;
    for (let i = startIdx; i < str.length; i++) {
        if (str[i] === '{') count++;
        if (str[i] === '}') count--;
        if (count === 0) return i;
    }
    return -1;
}

function processFile(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Remove require
    code = code.replace(/const localDb = require\(.*?localDbService.*?\);\r?\n?/g, '');
    code = code.replace(/const isMongoConnected = \(\) => .*?;\r?\n?/g, '');
    
    // While there is an if (isMongoConnected()) or mongoose equivalent
    while (true) {
        let idx1 = code.indexOf('if (isMongoConnected()) {');
        let idx2 = code.indexOf('if (mongoose.connection.readyState === 1) {');
        
        let idx = -1;
        let length = 0;
        
        if (idx1 !== -1) {
            idx = idx1;
            length = 'if (isMongoConnected()) {'.length;
        } else if (idx2 !== -1) {
            idx = idx2;
            length = 'if (mongoose.connection.readyState === 1) {'.length;
        } else {
            break; // No more matches
        }
        
        let openBraceIdx = idx + length - 1;
        let closeBraceIdx = getMatchingBraceEnd(code, openBraceIdx);
        
        let innerBody = code.substring(openBraceIdx + 1, closeBraceIdx);
        
        let beforeIf = code.substring(0, idx);
        let afterIf = code.substring(closeBraceIdx + 1);
        
        // check if there is an else
        let afterIfTrim = afterIf.trimStart();
        if (afterIfTrim.startsWith('else {')) {
            let elseIdx = code.indexOf('else {', closeBraceIdx);
            let elseOpenBraceIdx = elseIdx + 5;
            let elseCloseBraceIdx = getMatchingBraceEnd(code, elseOpenBraceIdx);
            afterIf = code.substring(elseCloseBraceIdx + 1);
        } else if (afterIfTrim.startsWith('else if (!isMongoConnected()) {')) {
            let elseIdx = code.indexOf('else if (!isMongoConnected()) {', closeBraceIdx);
            let elseOpenBraceIdx = elseIdx + 30;
            let elseCloseBraceIdx = getMatchingBraceEnd(code, elseOpenBraceIdx);
            afterIf = code.substring(elseCloseBraceIdx + 1);
        }
        
        code = beforeIf + innerBody + afterIf;
    }

    // Now handle cases with if (!isMongoConnected()) { ... } else { ... }
    while (true) {
        let idx = code.indexOf('if (!isMongoConnected()) {');
        if (idx === -1) break;
        let length = 'if (!isMongoConnected()) {'.length;
        let openBraceIdx = idx + length - 1;
        let closeBraceIdx = getMatchingBraceEnd(code, openBraceIdx);
        
        let beforeIf = code.substring(0, idx);
        let afterIf = code.substring(closeBraceIdx + 1);
        
        let afterIfTrim = afterIf.trimStart();
        if (afterIfTrim.startsWith('else {')) {
            let elseIdx = code.indexOf('else {', closeBraceIdx);
            let elseOpenBraceIdx = elseIdx + 5;
            let elseCloseBraceIdx = getMatchingBraceEnd(code, elseOpenBraceIdx);
            let innerMongoBody = code.substring(elseOpenBraceIdx + 1, elseCloseBraceIdx);
            afterIf = innerMongoBody + code.substring(elseCloseBraceIdx + 1);
        }
        
        code = beforeIf + afterIf;
    }
    
    fs.writeFileSync(file, code);
}

const files = [
  'controllers/authController.js',
  'controllers/assessmentController.js',
  'controllers/calendarController.js',
  'controllers/careerController.js',
  'controllers/performanceController.js',
  'controllers/questionController.js',
  'controllers/recommendationController.js',
  'controllers/resourceController.js',
  'controllers/skillGapController.js',
  'controllers/userController.js',
  'services/activityService.js',
  'services/gamificationEngine.js',
  'services/recommendationEngine.js',
  'middleware/authMiddleware.js'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        processFile(f);
        console.log("Processed " + f);
    }
});
