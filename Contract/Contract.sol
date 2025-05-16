// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract StakeGames {
    enum GameType { Plinko, Dice, Mines }

    struct GameSession {
        uint256 sessionId;
        address player;
        GameType game;
        uint256 betAmount;
        bool isWin;
        uint256 payout;
        bool isplayed;
        bool isresolved;
        uint256 timestamp;
        uint8 betnum;
        bool rollu;
        uint8 safeTilesFound;

    }

    uint256 public sessionCounter;
    mapping(uint256 => GameSession) public sessions;
    mapping(address => uint256[]) public userSessions;
    uint256[] public allSessionIds; 

    event BetPlaced(uint256 indexed sessionId, address indexed player, GameType game, uint256 amount);
    event GameResult(uint256 indexed sessionId, bool isWin, uint256 payout,uint256 multiplier,uint8 outcome);
    event GameResultDice(uint256 indexed sessionId, bool isWin, uint256 payout,uint256 outcome);
    event GameWithDraw(uint256 indexed sessionId,  uint256 payout);

    address public owner;

    mapping (uint8=>uint256)public dicemultiplier;
    constructor() {
        owner = msg.sender;
         multipliers[0] = 50;
        multipliers[1] = 20;
        multipliers[2] = 15;
        multipliers[3] = 12 ;
        multipliers[4] = 10 ;
        multipliers[5] = 8 ;
        multipliers[6] = 5 ;
        multipliers[7] = 3 ;
        multipliers[8] = 0 ;
        multipliers[9] = 3 ;
        multipliers[10] = 5 ;
        multipliers[11] = 8 ;
        multipliers[12] = 10 ;
        multipliers[13] = 12 ;
        multipliers[14] = 15 ;
        multipliers[15] = 20 ;
        multipliers[16] = 50 ;
        dicemultiplier[1]=50;
        dicemultiplier[2]=100;
        dicemultiplier[3]=120;
        dicemultiplier[4]=130;
        dicemultiplier[5]=140;
        dicemultiplier[6]=150;
        _initMinesMultipliers(); 
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function placeBet(GameType _game,uint8 betnum,bool roll) external payable returns (uint256 sessionId) {
        require(msg.value > 0, "Bet must be > 0");

         sessionId = sessionCounter++;
        if(_game==GameType.Plinko){
        sessions[sessionId] = GameSession({
            sessionId: sessionId,
            player: msg.sender,
            game: _game,
            betAmount: msg.value,
            isWin: false,
            payout: 0,
            isplayed:false,
            isresolved: false,
            timestamp: block.timestamp,
            betnum:0,
            rollu:false,
             safeTilesFound:0
        });
        plinkoGameResult(sessionId);
        }
        else if(_game==GameType.Dice){
            sessions[sessionId]=GameSession({
                sessionId: sessionId,
                player: msg.sender,
                game: _game,
                betAmount: msg.value,
                isWin: false,
                payout: 0,
                isplayed:false,
                isresolved: false,
                timestamp: block.timestamp,
                betnum: betnum,
                rollu:roll,
                safeTilesFound:0

            });
            DiceGameResult(sessionId);


        }
        else if(_game==GameType.Mines){
             sessions[sessionId]=GameSession({
                sessionId: sessionId,
                player: msg.sender,
                game: _game,
                betAmount: msg.value,
                isWin: false,
                payout: 0,
                isplayed:false,
                isresolved: false,
                timestamp: block.timestamp,
                betnum: betnum,
                rollu:false,
                safeTilesFound:0
                

            });
        }
            
        

        allSessionIds.push(sessionId); 
        userSessions[msg.sender].push(sessionId);

        emit BetPlaced(sessionId, msg.sender, _game, msg.value);
        return sessionId;
    }


    mapping(uint8 =>uint256 ) public multipliers;


    function plinkoGameResult(uint256 sessionId) public  returns (  uint256 multiplier) {
    uint8 outcome = 0;
    GameSession storage session=sessions[sessionId];
    require(session.isplayed==false,"Already played");

    for (uint8 i = 0; i < 16; i++) {
        uint256 rand = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            gasleft(),
            i
        ))) % 2;

        if (rand == 1) {
            outcome++;
        } 
    }
    if(outcome==0 || outcome==16){
        outcome=1;
    }

    
    multiplier = multipliers[outcome];
    uint256 totalAmount=session.betAmount*multiplier;
    totalAmount=totalAmount/10;
    if(multiplier>1){
        session.isWin=true;
    }
    session.payout=totalAmount;
    session.isplayed=true;
    emit GameResult(sessionId, session.isWin, session.payout,multiplier,outcome);
    

    return (multiplier);
}

function DiceGameResult(uint256 sessionId) public returns (uint256 outcome){
    GameSession storage session=sessions[sessionId];
    require(session.isplayed==false,"Already played");
    require(session.player==msg.sender,"Not Verified Player ");
    //generate random number between 1 and 6
    uint256 outcome1 = uint256(keccak256(abi.encodePacked(
    block.timestamp,
    block.prevrandao,
    msg.sender,
    gasleft()
))) % 6 +1;


    if((session.rollu==true && outcome1>=session.betnum) || (session.rollu==false && outcome1<=session.betnum) ){
        if(session.rollu==true){
            session.payout=session.betAmount*dicemultiplier[session.betnum]/100;
        }
        else {
            session.payout=session.betAmount*dicemultiplier[7-session.betnum]/100;
        }

    }
    else session.payout=0;
    if(session.payout>0)session.isWin=true;
    session.isplayed=true;
    emit GameResultDice(sessionId,session.isWin,session.payout,outcome1);
    return outcome1;

    

}



    

   function resolveGame(uint256 sessionId) external {
    require(sessionId < sessionCounter, "Invalid session ID");
    GameSession storage session = sessions[sessionId];
    require(msg.sender == session.player, "Not Verified Player");
    require(!session.isresolved, "Already resolved");
    require(session.player != address(0), "Invalid player address");

    if (session.game == GameType.Mines) {
       
        require(
            session.isplayed || session.safeTilesFound > 0,
            "Game not played or no winnings yet"
        );
    } else {
        require(session.isplayed, "Game not played yet");
    }

    uint256 payout = session.payout;
    require(payout > 0, "No payout available");

    session.isresolved = true;

    (bool sent, ) = payable(session.player).call{value: payout}("");
    require(sent, "Transfer failed");

    emit GameWithDraw(sessionId, payout);
}

mapping(uint8 => uint256) public minesPerTileIncrement;

function _initMinesMultipliers() internal {
    for (uint8 mines = 1; mines <= 24; mines++) {
        uint256 safeTiles = 25 - mines;
        minesPerTileIncrement[mines] = safeTiles > 0 ? 50000 / safeTiles : 0; // 0.5 max increase split over safe tiles
    }
}


 function playMinesTile(uint256 sessionId) external returns (bool isMine, uint256 payout) {
        GameSession storage session = sessions[sessionId];
        require(session.player == msg.sender, "Not the player");
        require(session.game == GameType.Mines, "Not a Mines game");
        require(!session.isplayed, "Game already ended");
        require(session.betnum > 0 && session.betnum < 25, "Invalid number of mines");

        uint8 totalMines = session.betnum;
        uint8 safeTilesLeft = 25 - totalMines - session.safeTilesFound;
        require(safeTilesLeft > 0, "No safe tiles left");

        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    sessionId,
                    session.safeTilesFound
                )
            )
        ) % (25 - session.safeTilesFound);

        if (rand < safeTilesLeft) {
            // Safe tile clicked
            session.safeTilesFound++;

            uint256 baseMultiplier = 100000; 
          uint256 perTileIncrement = minesPerTileIncrement[session.betnum]; // 0.1 per tile
            uint256 rawMultiplier = baseMultiplier + (uint256(session.safeTilesFound) * perTileIncrement);

            // You can add house edge calculation here if needed

            session.payout = (session.betAmount * rawMultiplier) / 100000;
            session.isWin = true;

            // Check if all safe tiles uncovered — game over condition
            if (session.safeTilesFound == 25 - totalMines) {
                session.isplayed = true; // Mark game ended
            }

            emit GameResult(sessionId, true, session.payout, rawMultiplier, session.safeTilesFound);
            return (false, session.payout);
        } else {
            // Mine clicked — game over with zero payout
            session.payout = 0;
            session.isWin = false;
            session.isplayed = true; // Mark game ended

            emit GameResult(sessionId, false, 0, 0, session.safeTilesFound);
            return (true, 0);
        }
    }


    function getUserSessions(address user) external view returns (uint256[] memory) {
        return userSessions[user];
    }

    function getAllSessions() external view returns (GameSession[] memory) {
        GameSession[] memory result = new GameSession[](allSessionIds.length);
        for (uint256 i = 0; i < allSessionIds.length; i++) {
            result[i] = sessions[allSessionIds[i]];
        }
        return result;
    }

    receive() external payable {}
}