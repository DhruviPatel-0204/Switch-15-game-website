document.getElementById('radioForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedOption = document.querySelector('input[name="option"]:checked').value;
    let gridSize;

    if (selectedOption === 'Option 1') gridSize = 3; // 3x3
    if (selectedOption === 'Option 2') gridSize = 4; // 4x4
    if (selectedOption === 'Option 3') gridSize = 5; // 5x5

    const imageBox = document.getElementById('image-box');
    const imageUrl = imageBox.style.backgroundImage.replace(/url\(["']?|["']?\)/g, ""); // Extract URL

    // Load image and cut it into pieces
    const image = new Image();
    image.onload = () => cutImageUp(image, gridSize);
    image.src = imageUrl;
});

function cutImageUp(image, gridSize) {
    const numColsToCut = gridSize;
    const numRowsToCut = gridSize;
    const widthOfOnePiece = image.width / numColsToCut;
    const heightOfOnePiece = image.height / numRowsToCut;

    const imagePieces = [];

    for (let x = 0; x < numColsToCut; x++) {
        for (let y = 0; y < numRowsToCut; y++) {
            const canvas = document.createElement('canvas');
            canvas.width = widthOfOnePiece;
            canvas.height = heightOfOnePiece;
            const context = canvas.getContext('2d');

            // Cut the image piece
            context.drawImage(
                image,
                x * widthOfOnePiece,
                y * heightOfOnePiece,
                widthOfOnePiece,
                heightOfOnePiece,
                0,
                0,
                canvas.width,
                canvas.height
            );

            imagePieces.push(canvas.toDataURL());
        }
    }

    renderPuzzle(imagePieces, gridSize);
}

function renderPuzzle(imagePieces, gridSize) {
    const imageBox = document.getElementById('image-box');
    imageBox.innerHTML = ''; // Clear existing content

    const pieceSize = imageBox.offsetWidth / gridSize;

    imagePieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.style.width = `${pieceSize}px`;
        pieceElement.style.height = `${pieceSize}px`;
        pieceElement.style.backgroundImage = `url(${piece})`;
        pieceElement.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
        pieceElement.style.backgroundPosition = `${(index % gridSize) * -100 / (gridSize - 1)}% ${(Math.floor(index / gridSize)) * -100 / (gridSize - 1)}%`;
        pieceElement.style.border = '1px solid #000';
        pieceElement.classList.add('puzzle-piece');
        imageBox.appendChild(pieceElement);
    });

    // Add interactivity for sliding puzzle logic
    initializePuzzleLogic(gridSize);
}

function initializePuzzleLogic(gridSize) {
    // Placeholder: Implement sliding puzzle game logic
    console.log(`Sliding puzzle initialized with grid size: ${gridSize}x${gridSize}`);
}
