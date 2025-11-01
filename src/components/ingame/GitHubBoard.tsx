import React from 'react';
import monopolyJSON from '../../assets/monopoly.json';
import '../../github-board.css';

interface Property {
    id: string;
    name: string;
    posistion: number;
    price?: number;
    group: string;
}

const GitHubBoard: React.FC = () => {
    // Map properties by position for easy lookup
    const propertiesByPosition = new Map<number, Property>();
    monopolyJSON.properties.forEach((prop: any) => {
        propertiesByPosition.set(prop.posistion, prop as Property);
    });

    // Get property color class based on group
    const getColorClass = (group: string): string => {
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

    // Render property space
    const renderProperty = (position: number) => {
        const prop = propertiesByPosition.get(position);
        if (!prop) return null;

        const colorClass = getColorClass(prop.group);
        
        return (
            <div key={position} className="space property">
                <div className="container">
                    <div className={`color-bar ${colorClass}`}></div>
                    <div className="name">{prop.name}</div>
                    {prop.price && <div className="price">PRICE ${prop.price}</div>}
                </div>
            </div>
        );
    };

    // Render railroad space
    const renderRailroad = (position: number) => {
        const prop = propertiesByPosition.get(position);
        if (!prop) return null;

        return (
            <div key={position} className="space railroad">
                <div className="container">
                    <div className="name">{prop.name}</div>
                    <i className="drawing fa fa-subway"></i>
                    {prop.price && <div className="price">Price ${prop.price}</div>}
                </div>
            </div>
        );
    };

    // Render utility space
    const renderUtility = (position: number, type: 'electric' | 'water') => {
        const prop = propertiesByPosition.get(position);
        if (!prop) return null;

        const iconClass = type === 'electric' ? 'fa-lightbulb-o' : 'fa-tint';
        const utilityClass = type === 'electric' ? 'electric-company' : 'waterworks';

        return (
            <div key={position} className={`space utility ${utilityClass}`}>
                <div className="container">
                    <div className="name">{prop.name}</div>
                    <i className={`drawing fa ${iconClass}`}></i>
                    {prop.price && <div className="price">Price ${prop.price}</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="table">
            <div className="board">
                {/* Center area */}
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

                {/* GO Corner */}
                <div className="space corner go">
                    <div className="container">
                        <div className="instructions">Collect $200.00 salary as you pass</div>
                        <div className="go-word">go</div>
                    </div>
                    <div className="arrow fa fa-long-arrow-left"></div>
                </div>

                {/* Bottom Row (positions 9 down to 1) */}
                <div className="row horizontal-row bottom-row">
                    {renderProperty(9)}  {/* Connecticut Avenue */}
                    {renderProperty(8)}  {/* Vermont Avenue */}
                    <div className="space chance">
                        <div className="container">
                            <div className="name">Chance</div>
                            <i className="drawing fa fa-question"></i>
                        </div>
                    </div>
                    {renderProperty(6)}  {/* Oriental Avenue */}
                    {renderRailroad(5)}  {/* Reading Railroad */}
                    <div className="space fee income-tax">
                        <div className="container">
                            <div className="name">Income Tax</div>
                            <div className="diamond"></div>
                            <div className="instructions">Pay 10%<br/>or<br/>$200</div>
                        </div>
                    </div>
                    {renderProperty(3)}  {/* Baltic Avenue */}
                    <div className="space community-chest">
                        <div className="container">
                            <div className="name">Community Chest</div>
                            <i className="drawing fa fa-cube"></i>
                            <div className="instructions">Follow instructions on top card</div>
                        </div>
                    </div>
                    {renderProperty(1)}  {/* Mediterranean Avenue */}
                </div>

                {/* Jail Corner */}
                <div className="space corner jail">
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

                {/* Left Row (positions 11-19) */}
                <div className="row vertical-row left-row">
                    {renderProperty(19)} {/* New York Avenue */}
                    {renderProperty(18)} {/* Tennessee Avenue */}
                    <div className="space community-chest">
                        <div className="container">
                            <div className="name">Community Chest</div>
                            <i className="drawing fa fa-cube"></i>
                            <div className="instructions">Follow instructions on top card</div>
                        </div>
                    </div>
                    {renderProperty(16)} {/* St. James Place */}
                    {renderRailroad(15)} {/* Pennsylvania Railroad */}
                    {renderProperty(14)} {/* Virginia Avenue */}
                    {renderProperty(13)} {/* States Avenue */}
                    {renderUtility(12, 'electric')} {/* Electric Company */}
                    {renderProperty(11)} {/* St. Charles Place */}
                </div>

                {/* Free Parking Corner */}
                <div className="space corner free-parking">
                    <div className="container">
                        <div className="name">Free</div>
                        <i className="drawing fa fa-car"></i>
                        <div className="name">Parking</div>
                    </div>
                </div>

                {/* Top Row (positions 21-29) */}
                <div className="row horizontal-row top-row">
                    {renderProperty(21)} {/* Kentucky Avenue */}
                    <div className="space chance">
                        <div className="container">
                            <div className="name">Chance</div>
                            <i className="drawing fa fa-question blue"></i>
                        </div>
                    </div>
                    {renderProperty(23)} {/* Indiana Avenue */}
                    {renderProperty(24)} {/* Illinois Avenue */}
                    {renderRailroad(25)} {/* B & O Railroad */}
                    {renderProperty(26)} {/* Atlantic Avenue */}
                    {renderProperty(27)} {/* Ventnor Avenue */}
                    {renderUtility(28, 'water')} {/* Water Works */}
                    {renderProperty(29)} {/* Marvin Gardens */}
                </div>

                {/* Go to Jail Corner */}
                <div className="space corner go-to-jail">
                    <div className="container">
                        <div className="name">Go To</div>
                        <i className="drawing fa fa-gavel"></i>
                        <div className="name">Jail</div>
                    </div>
                </div>

                {/* Right Row (positions 31-39) */}
                <div className="row vertical-row right-row">
                    {renderProperty(31)} {/* Pacific Avenue */}
                    {renderProperty(32)} {/* North Carolina Avenue */}
                    <div className="space community-chest">
                        <div className="container">
                            <div className="name">Community Chest</div>
                            <i className="drawing fa fa-cube"></i>
                            <div className="instructions">Follow instructions on top card</div>
                        </div>
                    </div>
                    {renderProperty(34)} {/* Pennsylvania Avenue */}
                    {renderRailroad(35)} {/* Short Line */}
                    <div className="space chance">
                        <div className="container">
                            <div className="name">Chance</div>
                            <i className="drawing fa fa-question"></i>
                        </div>
                    </div>
                    {renderProperty(37)} {/* Park Place */}
                    <div className="space fee luxury-tax">
                        <div className="container">
                            <div className="name">Luxury Tax</div>
                            <div className="drawing fa fa-diamond"></div>
                            <div className="instructions">Pay $75.00</div>
                        </div>
                    </div>
                    {renderProperty(39)} {/* Boardwalk */}
                </div>
            </div>
        </div>
    );
};

export default GitHubBoard;

