/**
 * Represents the position of an item in the room
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Represents available furniture types and their positions in the sprite sheet
 */
export const FURNITURE_SPRITES = {
    'window': { x: 0, y: 0, width: 64, height: 64 },
    'cat_post': { x: 256, y: 0, width: 48, height: 96 },
    'bed': { x: 0, y: 96, width: 96, height: 48 },
    'shelf': { x: 0, y: 144, width: 64, height: 96 },
    'plant': { x: 64, y: 144, width: 48, height: 96 },
    'bowl': { x: 144, y: 144, width: 32, height: 32 }
} as const;

/**
 * Configuration de l'animation du chat
 */
export const CAT_ANIMATION = {
    frameWidth: 32,
    frameHeight: 32,
    totalFrames: 4  // Nombre de frames pour l'animation de la queue
};

/**
 * Represents a furniture item that can be placed in the room
 */
export interface FurnitureItem {
    id: string;
    type: keyof typeof FURNITURE_SPRITES;
    position: Position;
}

/**
 * Represents the state of Pedro (our cat companion)
 */
export interface PedroState {
    position: Position;
    currentFrame: number;
    currentFurniture: string | null; // ID du meuble sur lequel le chat est posé
}

/**
 * Represents the room state with all furniture and decorations
 */
export interface RoomState {
    furniture: FurnitureItem[];
    pedro: PedroState;
    selectedFurniture: keyof typeof FURNITURE_SPRITES | null;
}

/**
 * Available commands for interacting with Pedro
 */
export enum PedroCommand {
    PlaceFurniture = 'place_furniture',
    MovePedro = 'move_pedro'
} 