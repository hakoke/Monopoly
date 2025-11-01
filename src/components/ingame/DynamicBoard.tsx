import React from 'react';
import monopolyJSON from '../../assets/monopoly.json';
import { translateGroup } from './streetCard';
import '../../dynamic-board.css';

interface TileData {
    id: string;
    name: string;
    posistion: number;
    price?: number;
    group: string;
}

const DynamicBoard: React.FC = () => {
    // Create a map for easy lookup
    const propertyMap = new Map<string, TileData>();
    monopolyJSON.properties.forEach((prop: any) => {
        propertyMap.set(prop.id, prop as TileData);
    });

    // Get the position class for tile
    const getPositionClass = (position: number): string => {
        if (position >= 1 && position <= 9) return 'tile-bottom';
        if (position >= 11 && position <= 19) return 'tile-left';
        if (position >= 21 && position <= 29) return 'tile-top';
        if (position >= 31 && position <= 39) return 'tile-right';
        return '';
    };

    // Render a property tile
    const renderPropertyTile = (tileId: string, position: number) => {
        const property = propertyMap.get(tileId);
        if (!property) return null;

        const { name, price, group } = property;
        const colorBarColor = translateGroup(group);
        const posClass = getPositionClass(position);

        return (
            <div key={position} className={`tile-property ${posClass} pos-${position}`}>
                <div className="property-color-bar" style={{ backgroundColor: colorBarColor }}></div>
                <div className="property-content">
                    <p className="property-name">{name}</p>
                    {price && <p className="property-price">M{price}</p>}
                </div>
            </div>
        );
    };

    // Render a railroad tile
    const renderRailroadTile = (tileId: string, position: number) => {
        const property = propertyMap.get(tileId);
        if (!property) return null;

        const { name, price } = property;
        const posClass = getPositionClass(position);

        return (
            <div key={position} className={`tile-railroad tile-property ${posClass} pos-${position}`}>
                <div className="property-color-bar" style={{ backgroundColor: '#000' }}></div>
                <div className="property-content">
                    <div className="railroad-icon">🚂</div>
                    <p className="property-name">{name}</p>
                    {price && <p className="property-price">M{price}</p>}
                </div>
            </div>
        );
    };

    // Render a utility tile
    const renderUtilityTile = (tileId: string, position: number) => {
        const property = propertyMap.get(tileId);
        if (!property) return null;

        const { name, price } = property;
        const posClass = getPositionClass(position);
        const icon = tileId.includes('electric') ? '💡' : '💧';

        return (
            <div key={position} className={`tile-utility tile-property ${posClass} pos-${position}`}>
                <div className="property-content">
                    <div className="utility-icon">{icon}</div>
                    <p className="property-name">{name}</p>
                    {price && <p className="property-price">M{price}</p>}
                </div>
            </div>
        );
    };

    // Render corner tiles
    const renderCornerTile = (tileId: string, position: number) => {
        let className = 'tile-corner';
        let content: React.ReactNode = null;

        switch (tileId) {
            case 'go':
                className += ' go';
                content = (
                    <>
                        <div className="corner-content">
                            <div style={{ fontSize: '14px', marginBottom: '5px' }}>COLLECT $200</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>GO</div>
                        </div>
                        <div className="arrow">→</div>
                    </>
                );
                break;
            case 'jail':
                className += ' jail';
                content = (
                    <div className="corner-content" style={{ color: '#000', fontSize: '12px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>JAIL</div>
                        <div style={{ fontSize: '9px' }}>Just Visiting</div>
                    </div>
                );
                break;
            case 'freeparking':
                className += ' free-parking';
                content = (
                    <div className="corner-content" style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                        FREE<br />PARKING
                    </div>
                );
                break;
            case 'gotojail':
                className += ' go-to-jail';
                content = (
                    <div className="corner-content" style={{ fontSize: '14px' }}>
                        <div style={{ fontWeight: 'bold' }}>GO TO</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>JAIL</div>
                    </div>
                );
                break;
        }

        return (
            <div key={position} className={className}>
                {content}
            </div>
        );
    };

    // Render special tiles (Chance, Community Chest, Tax)
    const renderSpecialTile = (tileId: string, position: number) => {
        const property = propertyMap.get(tileId);
        const posClass = getPositionClass(position);
        let className = `tile-special ${posClass} pos-${position}`;
        let icon = '';
        let text = '';

        if (tileId === 'chance') {
            className += ' tile-chance';
            icon = '?';
            text = 'CHANCE';
        } else if (tileId === 'communitychest') {
            className += ' tile-community-chest';
            icon = '📦';
            text = 'COMMUNITY CHEST';
        } else if (tileId === 'incometax') {
            className += ' tile-tax';
            icon = '💰';
            text = 'INCOME TAX';
        } else if (tileId === 'luxerytax') {
            className += ' tile-tax';
            icon = '💎';
            text = 'LUXURY TAX';
        }

        return (
            <div key={position} className={className}>
                <div className="special-content">
                    <div className="special-icon">{icon}</div>
                    <p className="special-text">{text}</p>
                </div>
            </div>
        );
    };

    // Render tile based on type
    const renderTile = (tileId: string, position: number) => {
        const property = propertyMap.get(tileId);
        if (!property) return null;

        const { group } = property;

        // Corner tiles
        if (position === 0) return renderCornerTile('go', position);
        if (position === 10) return renderCornerTile('jail', position);
        if (position === 20) return renderCornerTile('freeparking', position);
        if (position === 30) return renderCornerTile('gotojail', position);

        // Special tiles
        if (tileId === 'chance' || tileId === 'communitychest' || 
            tileId === 'incometax' || tileId === 'luxerytax') {
            return renderSpecialTile(tileId, position);
        }

        // Railroad tiles
        if (group === 'Railroad') {
            return renderRailroadTile(tileId, position);
        }

        // Utility tiles
        if (group === 'Utilities') {
            return renderUtilityTile(tileId, position);
        }

        // Regular property tiles
        return renderPropertyTile(tileId, position);
    };

    return (
        <div className="dynamic-board-container">
            {/* Render center */}
            <div className="board-center">
                <div className="board-title">MONOPOLY</div>
            </div>

            {/* Render all tiles */}
            {monopolyJSON.tiles.map((tile: any, index: number) => 
                renderTile(tile.id, index)
            )}
        </div>
    );
};

export default DynamicBoard;

