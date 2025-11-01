import { useEffect, useRef } from "react";
import monopolyJSON from "../../assets/monopoly.json";
import "../../css-grid-board.css";

interface CSSGridBoardProps {
    players: Array<any>;
    clickedOnBoard: (position: number) => void;
}

const CSSGridBoard = ({ players, clickedOnBoard }: CSSGridBoardProps) => {
    const boardRef = useRef<HTMLDivElement>(null);

    // Build property map for quick lookups
    const propertyMap = new Map(
        monopolyJSON.properties.map((prop) => [prop.posistion, prop])
    );

    // Get property by position
    const getProperty = (position: number) => {
        return propertyMap.get(position);
    };

    // Get color class for property groups
    const getColorClass = (group: string | undefined): string => {
        if (!group) return '';
        const colorMap: { [key: string]: string } = {
            'Purple': 'dark-purple',
            'lightgreen': 'light-blue',
            'Violet': 'purple',
            'Orange': 'orange',
            'Red': 'red',
            'Yellow': 'yellow',
            'darkgreen': 'green',
            'darkblue': 'dark-blue'
        };
        return colorMap[group] || '';
    };

    // Bottom row properties (positions 1-9)
    const bottomRowPositions = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    
    // Left row properties (positions 11-19)
    const leftRowPositions = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    
    // Top row properties (positions 21-29)
    const topRowPositions = [21, 22, 23, 24, 25, 26, 27, 28, 29];
    
    // Right row properties (positions 31-39)
    const rightRowPositions = [39, 38, 37, 36, 35, 34, 33, 32, 31];

    // Render a property space
    const renderProperty = (position: number) => {
        const property = getProperty(position);
        if (!property) return null;

        const isProperty = property.group && !['Special', 'Railroad', 'Utilities'].includes(property.group);
        const isRailroad = property.group === 'Railroad';
        const isUtility = property.group === 'Utilities';
        const isChance = property.id === 'chance';
        const isCommunityChest = property.id === 'communitychest';
        const isIncomeTax = property.id === 'incometax';
        const isLuxuryTax = property.id === 'luxerytax';

        return (
            <div
                key={position}
                className={`space ${isProperty ? 'property' : ''} ${isRailroad ? 'railroad' : ''} ${isUtility ? 'utility' : ''} ${isChance ? 'chance' : ''} ${isCommunityChest ? 'community-chest' : ''} ${isIncomeTax || isLuxuryTax ? 'fee' : ''} ${isUtility && property.id === 'electriccompany' ? 'electric-company' : ''} ${isUtility && property.id === 'waterworks' ? 'waterworks' : ''}`}
                data-position={position}
                onClick={() => clickedOnBoard(position)}
            >
                <div className="container">
                    {isProperty && (
                        <>
                            <div className={`color-bar ${getColorClass(property.group)}`}></div>
                            <div className="name">{property.name}</div>
                            <div className="price">PRICE ${property.price}</div>
                        </>
                    )}
                    {isRailroad && (
                        <>
                            <div className="name">{property.name}</div>
                            <i className="drawing fa fa-subway"></i>
                            <div className="price">Price ${property.price}</div>
                        </>
                    )}
                    {isUtility && (
                        <>
                            <div className="name">{property.name}</div>
                            <i className={`drawing fa ${property.id === 'electriccompany' ? 'fa-lightbulb-o' : 'fa-tint'}`}></i>
                            <div className="price">Price ${property.price}</div>
                        </>
                    )}
                    {isChance && (
                        <>
                            <div className="name">Chance</div>
                            <i className="drawing fa fa-question"></i>
                        </>
                    )}
                    {isCommunityChest && (
                        <>
                            <div className="name">Community Chest</div>
                            <i className="drawing fa fa-cube"></i>
                            <div className="instructions">Follow instructions on top card</div>
                        </>
                    )}
                    {isIncomeTax && (
                        <>
                            <div className="name">Income Tax</div>
                            <div className="diamond"></div>
                            <div className="instructions">Pay 10%<br />or<br />$200</div>
                        </>
                    )}
                    {isLuxuryTax && (
                        <>
                            <div className="name">Luxury Tax</div>
                            <div className="drawing fa fa-diamond"></div>
                            <div className="instructions">Pay $75.00</div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Update player positions
    useEffect(() => {
        if (!boardRef.current) return;

        // Clear all player pieces
        boardRef.current.querySelectorAll('.player-piece').forEach(piece => piece.remove());

        // Add player pieces to their positions
        players.forEach(player => {
            const spaceElement = boardRef.current?.querySelector(`[data-position="${player.position}"]`);
            if (spaceElement) {
                const piece = document.createElement('div');
                piece.className = 'player-piece';
                piece.innerHTML = `<img src="/p${player.icon}.png" alt="${player.username}" />`;
                spaceElement.appendChild(piece);
            }
        });
    }, [players]);

    return (
        <div className="css-grid-board-container">
            <div className="board css-grid-board" ref={boardRef}>
                <div className="center">
                    <div className="community-chest-deck">
                        <h2 className="label">Community Chest</h2>
                        <div className="deck"></div>
                    </div>
                    <h1 className="title">MONOPOLY</h1>
                    <div className="chance-deck">
                        <h2 className="label">Chance</h2>
                        <div className="deck"></div>
                    </div>
                </div>

                {/* GO Corner (Bottom Right) */}
                <div className="space corner go" data-position="0" onClick={() => clickedOnBoard(0)}>
                    <div className="container">
                        <div className="instructions">Collect $200.00 salary as you pass</div>
                        <div className="go-word">GO</div>
                    </div>
                    <div className="arrow fa fa-long-arrow-left"></div>
                </div>

                {/* Bottom Row */}
                <div className="row horizontal-row bottom-row">
                    {bottomRowPositions.map(pos => renderProperty(pos))}
                </div>

                {/* Jail Corner (Bottom Left) */}
                <div className="space corner jail" data-position="10" onClick={() => clickedOnBoard(10)}>
                    <div className="just">Just</div>
                    <div className="drawing">
                        <div className="container">
                            <div className="name">In</div>
                            <div className="window">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <i className="person fa fa-frown-o"></i>
                            </div>
                            <div className="name">Jail</div>
                        </div>
                    </div>
                    <div className="visiting">Visiting</div>
                </div>

                {/* Left Row */}
                <div className="row vertical-row left-row">
                    {leftRowPositions.map(pos => renderProperty(pos))}
                </div>

                {/* Free Parking Corner (Top Left) */}
                <div className="space corner free-parking" data-position="20" onClick={() => clickedOnBoard(20)}>
                    <div className="container">
                        <div className="name">Free</div>
                        <i className="drawing fa fa-car"></i>
                        <div className="name">Parking</div>
                    </div>
                </div>

                {/* Top Row */}
                <div className="row horizontal-row top-row">
                    {topRowPositions.map(pos => renderProperty(pos))}
                </div>

                {/* Go To Jail Corner (Top Right) */}
                <div className="space corner go-to-jail" data-position="30" onClick={() => clickedOnBoard(30)}>
                    <div className="container">
                        <div className="name">Go To</div>
                        <i className="drawing fa fa-gavel"></i>
                        <div className="name">Jail</div>
                    </div>
                </div>

                {/* Right Row */}
                <div className="row vertical-row right-row">
                    {rightRowPositions.map(pos => renderProperty(pos))}
                </div>
            </div>
        </div>
    );
};

export default CSSGridBoard;

