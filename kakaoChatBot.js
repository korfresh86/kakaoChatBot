/*
 * 제작: YT헤움 (유튜브채널: https://youtube.com/c/헤움)
 * 배포: 비상업적 이용으로 무제한 배포 및 소스 수정 가능 합니다.
 */

const SuperAdmin = "헤움꿍/20@/데슬/헤움쓰";
const Admin = [
    "헤움꿍/20@/데슬/헤움쓰",
    "헤움꿍/20@/데슬/헤움쓰"
];
const lineMsg = "======================";
const blankMsg = '\u200b'.repeat (500);
const maxCount = 20;

const buff = ["비숍", "팔라", "분노", "에반", "와헌", "메디", "몽매", "윈부"];
//const hardBoss = ["루타", "반퀸", "반반", "퀸", "벨룸", "피에르", "노루타", "노4", "노룻", "카반퀸", "카반", "카퀸", "카피", "카벨", "힐라", "노힐", "하힐", "카힐", "매그"]
const hardBoss = ["테스트"];
const numberString = ["❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿", "⓫", "⓬", "⓭", "⓮", "⓯", "⓰", "⓱", "⓲", "⓳", "⓴"];

const path = {
    Boss: "sdcard/bot/member_t/boss.json",
    BossBackup: "sdcard/bot/member_t/boss_bak.json",
    Ver: "sdcard/bot/member_t/version.json",
    Member: "sdcard/bot/member_t/member.json",
}

let teamList = [];
let version = [];
let chatList = [];
let memberList = [];

const roomName = "봇테스트";
let count = 0;

File.createFolder("sdcard/bot/member_t");

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    if (room == roomName) {

        count = count + 1;
        if (count >= 10) {
            replier.markAsRead();
            count = 0;
        }

        let method = msg.split(" ");
        let MSG = "";

        const TeamNumber = method[1] ? Number(method[1].replace("팀", "")) - 1 : null;
        const MemberNumber = method[2] ? Number(method[2].replace("번", "")) - 1 : null;
        // const MemberName = method[3] && method[3].length > 0 ? method[3] : sender;
        let MemberName = "";
        const MemberJob = TRANS_JOB(sender);
        if(method[3] && method[3].length > 0)
        {
            for(let i = 3; i < method.length; i++)
            {
                MemberName += method[i]
            }
        }
        else
        {
            MemberName = sender.split("/")[0];
        }

        MemberName = MemberJob + " " + MemberName;

        if(chatList.length > 29)
        {
            chatList.shift();
        }
        chatList.push(sender + ": " + msg);

        teamList = FileLoad(path.Boss);
        if(teamList == null) teamList = []
        memberList = FileLoad(path.Member);
        if(memberList == null) memberList = []
        version = FileLoad(path.Ver);

        if (msg == "-봇상태") {
            replier.reply("'" + room + "'방, '" + sender + "'님, 배터리잔량은: " + Device.getBatteryLevel() + "%");
        }

        if (msg == "-관리자확인" && Admin.indexOf(sender) != -1) {
            replier.reply(sender + "'님, 관리자 입니다.");
        }

        if (msg == "-관리자목록") {
            let AdminList = "↓아래를 눌러 확인하세요↓\n" + blankMsg + "\n";
            Admin.forEach( (v, k) => {
                AdminList += v + "\n";
            })
            PRINT_MSG( AdminList );
        }

        if(msg == "-복원확인" && Admin.indexOf(sender) != -1)
        {
            PRINT_MSG( HANDLE_LIST_ALL(FileLoad(path.BossBackup)) );
        }

        if(msg == "-복원" && Admin.indexOf(sender) != -1)
        {
            teamList = FileLoad(path.BossBackup);
            FileSave(path.Boss, teamList)
            memberList = FileLoad(path.Member);
            PRINT_MSG( HANDLE_LIST_ALL(teamList) );
        }

        if(msg == "-참여도" && sender === SuperAdmin)
        {
            let message = "↓아래를 눌러 확인하세요↓\n" + blankMsg + "\n";
            memberList.forEach( (v, k) => {
                message += v.Name + " : " + v.Count + "\n";
            })
            PRINT_MSG( message );
        }

        if (msg == "-대화내역")
        {
            if(Admin.indexOf(sender) > -1)
            {
                let printMSG = "↓아래를 눌러 확인하세요↓\n" + blankMsg + "\n";
                for (let i = 0; i < chatList.length; i++)
                {
                    printMSG += chatList[i] + "\n\n";
                }
                PRINT_MSG(printMSG);
            }
            else
            {
                PRINT_MSG("관리자만 이용 가능 합니다.");
            }
        }

        if( msg.indexOf("-벌금") != -1)
        {
            if(Admin.indexOf(sender) > -1)
            {
                const thisTeam = teamList[Number(method[1]) - 1]
                let number = PENALTY(Number(method[2]), thisTeam);
                PRINT_MSG(thisTeam.Title + "팀의 " + thisTeam.Member[Number(method[2]) - 1] + " 님은 " + thisTeam.Member[number] + " 님에게 벌금 1억메소 주세요.");
            }
            else
            {
                PRINT_MSG( "벌금은 운영진만 가능합니다.\n운영진에게 요청 주세요." );
                return;
            }
        }

        if( msg.indexOf("-목록") != -1 )
        {
            let webVersion = Utils.getWebText2("https://hmobile-files.s3.ap-northeast-2.amazonaws.com/ver.txt");
            if(version != webVersion)
            {
                PRINT_MSG("헤움님의 유튜브 새 영상이 올라 왔습니다\n" + webVersion + "\n좋아요, 댓글은 큰 도움이 됩니다. \n감사합니다 ^^*");
                FileSave(path.Ver, webVersion);
            }

            if(method[1] === undefined)
            {
                PRINT_MSG( HANDLE_LIST_ALL(teamList) );
            }
            else
            {
                PRINT_MSG( method[1].replace("팀", "") + "팀"  + HANDLE_LIST(teamList[Number(method[1].replace("팀", "")) - 1]) );
            }

        }

        if( msg.indexOf("-시간") != -1)
        {
            teamList[TeamNumber].Time = method[2];
            PRINT_MSG( HANDLE_LIST_ALL(teamList) );
            FileSave(path.Boss, teamList)
            FileSave(path.BossBackup, teamList)
        }

        if( msg.indexOf("-수정") != -1)
        {
            if(Admin.indexOf(sender) > -1)
            {
                let TeamName = "";
                if(method.length > 2)
                {
                    for(let i = 2; i < method.length; i++)
                    {
                        TeamName += method[i]
                    }
                }

                teamList[Number(method[1] - 1)].Title = TeamName;
                PRINT_MSG( HANDLE_LIST_ALL(teamList) );
                FileSave(path.Boss, teamList)
                FileSave(path.BossBackup, teamList)
            }
            else
            {
                PRINT_MSG( "팀수정은 운영진만 가능합니다.\n운영진에게 요청 주세요." );
                return;
            }
        }

        if( msg.indexOf("-생성") != -1 )
        {
            if(Number(method[1].replace("명", "")) > maxCount || Number(method[1].replace("명", "")) < 1)
            {
                PRINT_MSG("생성 실패 !!\n" + maxCount + "명 보다 높게 생성 할 수 없습니다.\n명령인원: " + method[1]);
                return;
            }

            if(Number( method[1].replace("명", "") ) * 0 === 0)
            {
                let thisCount = Number(method[1].replace("명", ""));
                let TeamName = "";
                if(method.length > 2)
                {
                    for(let i = 2; i < method.length; i++)
                    {
                        TeamName += method[i]
                    }
                }

                let teamArr = {
                    Title: TeamName,
                    Count: thisCount,
                    Member: [],
                    Time: "모출"
                }

                let bossSwitch = false, bossArr = [];
                hardBoss.forEach( (v, k) => {
                    if(method[2].indexOf(v) != -1)
                    {
                        bossSwitch = true;
                    }
                })

                if(bossSwitch)
                {
                    buff.forEach( (val, key) => {
                        bossArr.push(null)
                    })
                    teamArr.Buff = bossArr;
                }

                teamList.push(teamArr);
                PRINT_MSG(HANDLE_LIST_ALL(teamList));
                FileSave(path.Boss, teamList)
                FileSave(path.BossBackup, teamList)
            }
        }

        if( msg.indexOf("-초기화") != -1 )
        {
            if(Admin.indexOf(sender) > -1)
            {
                if(method[1] === undefined)
                {
                    teamList = [];
                }
                else
                {
                    teamList[TeamNumber].Member = [];
                    teamList[TeamNumber].Time = "모출";
                }
                FileSave(path.Boss, teamList)
                PRINT_MSG( HANDLE_LIST_ALL(teamList) );
            }
            else
            {
                PRINT_MSG("관리자만 이용 가능 합니다.");
            }

        }

        if( msg.indexOf("-참가") != -1 )
        {
            if( buff.indexOf(method[2]) != -1 )
            {
                teamList[TeamNumber].Buff[buff.indexOf(method[2])] = MemberName;
            }
            else if(teamList[TeamNumber].Member[MemberNumber] === undefined || teamList[TeamNumber].Member[MemberNumber] === '')
            {
                teamList[TeamNumber].Member[MemberNumber] = MemberName;
            }
            else
            {
                PRINT_MSG("참가 실패 !!\n" + teamList[TeamNumber].Member[MemberNumber] + '님이 신청 되어 있습니다.');
                return;
            }

            PRINT_MSG( Number(TeamNumber + 1) + "팀"  + HANDLE_LIST(teamList[TeamNumber]) );

            MemberName = MemberName.replace(MemberJob + " ", "");
            if(memberList.filter( v => v.Name === MemberName).length < 1)
            {
                memberList.push({Name: MemberName, Count: 1});
            }
            else
            {
                memberList.filter( v => v.Name === MemberName)[0].Count++;
            }

            FileSave(path.Member, memberList)
            FileSave(path.Boss, teamList)
            FileSave(path.BossBackup, teamList)
        }

        if( msg.indexOf("-취소") != -1 )
        {
            if( buff.indexOf(method[2]) != -1 )
            {
                if(sender === teamList[TeamNumber].Buff[buff.indexOf(method[2])] || Admin.indexOf(sender) > -1)
                {
                    teamList[TeamNumber].Buff[buff.indexOf(method[2])] = null;
                    PRINT_MSG( (Number(TeamNumber + 1)) + "팀"  + HANDLE_LIST(teamList[TeamNumber]) );
                    FileSave(path.Boss, teamList)
                    FileSave(path.BossBackup, teamList)
                }
                return;
            }
            else
            {
                teamList[TeamNumber].Member[MemberNumber] = undefined;
                PRINT_MSG( (Number(TeamNumber + 1)) + "팀"  + HANDLE_LIST(teamList[TeamNumber]) );
                FileSave(path.Boss, teamList)
                FileSave(path.BossBackup, teamList)
            }
        }

        if( msg.indexOf("-삭제") != -1 )
        {
            if (Admin.indexOf(sender) == -1)
            {
                PRINT_MSG( "팀삭제는 운영진만 가능합니다.\n운영진에게 요청 주세요." );
                return;
            }

            let tmpTeamList = [];

            for (let i = 0; i < teamList.length; i++)
            {
                if(i + 1 !== Number(method[1].replace("팀", "")))
                {
                    tmpTeamList.push(teamList[i]);
                }
            }

            teamList = tmpTeamList;
            FileSave(path.Boss, teamList)
            PRINT_MSG( HANDLE_LIST_ALL(teamList) );

        }

        if( msg.indexOf("-딜계산") != -1 )
        {
            let regEx = /^[\d]{1,2}:[\d]{1,2}/gi

            // 명령어, 시간, 누적딜
            if( method[0] && method[1] && regEx.test(method[1]) && method[2] )
            {
                let timeToSecArr = method[1].split(":");
                let timeToSec = ( Number(timeToSecArr[0]) * 60) + Number(timeToSecArr[1]);

                let DPM = Math.ceil( Number(method[2] / timeToSec) * 60 / 100000000 );

                PRINT_MSG( method[1] + "초동안의 DPM은 " + DPM + "억 입니다." );
            }
        }

        if( msg.indexOf("-딜목표") != -1 )
        {
            let regEx = /^[\d]{1,2}:[\d]{1,2}/gi

            // 명령어, 시간, 누적딜
            if( method[0] && method[1] && regEx.test(method[1]) && method[2] )
            {
                let timeToSecArr = method[1].split(":");
                let timeToSec = ( Number(timeToSecArr[0]) * 60) + Number(timeToSecArr[1]);
                let resultDMG = Math.ceil( Number( method[2]) * 100000000 / 60 * timeToSec ).toLocaleString();

                PRINT_MSG( method[1] + "초동안 " + method[2] + "억의 누적딜량은 " + resultDMG + " 입니다." );
            }
        }

        if (msg == "-도움말") {
            PRINT_MSG(
                "↓아래를 눌러 확인하세요↓" + blankMsg +
                "\n" + lineMsg + "\n::사용가능 명령어::\n" + lineMsg +
                "\n\n-목록 : 전체 팀 목록이 보입니다.\n" +
                "-목록 {팀번호} : 특정팀 상세현황이 보입니다.\n" +
                " 예) /목록 1팀\n" +

                "\n\n-생성 {인원} {제목} \n" +
                " 예) -생성 5명 노루타\n" +

                "\n\n-참가 {팀번호} {자리번호}\n" +
                " 예) -참가 2팀 9번\n" +

                "\n\n-취소 {팀번호} {자리번호}\n" +
                " 예) -취소 2팀 9번\n" +

                "\n\n-삭제 {팀번호}\n" +
                " 예) -삭제 1팀\n" +

                "\n\n-수정 {팀번호} {팀명}\n" +
                " 예) -수정 1팀 헤움잘생김\n" +

                "\n\n-시간 {팀번호} {시간}\n" +
                " 예) -시간 1팀 20:00\n" +

                "\n\n-딜계산 : 시간대비 DPM을 계산합니다\n" +
                "-딜계산 {시간} {총데미지}\n" +
                " 예) -딜계산 9:12 132522010\n" +

                "\n\n-딜목표 : 해당시간의 목표DPM의 총 데미지를 계산합니다\n" +
                "-딜목표 {시간} {목표DPM}\n" +
                " 예) -딜목표 9:12 200\n" +

                "\n\n-벌금 : 해당팀의 벌금자를 랜덤으로 선정 합니다\n" +
                "-벌금 {팀번호} {벌금자번호}\n" +
                " 예) -벌금 1팀 3번\n" +

                "\n\n-복원확인 : 마지막 저장된 팀을 확인 합니다\n" +
                "\n\n-복원 : 마지막 저장된 팀을 복원 합니다\n" +
                "\n\n-초기화 : 등록된 모든 팀을 삭제 합니다.\n" +
                "\n\n-초기화 {팀명} : 선택한 팀을 초기화 합니다.\n" +
                " 예) -초기화 1팀\n" +

                "-대화내역\n\n" +
                "-관리자확인\n\n" +
                "-관리자목록\n\n" +

                "-도움말\n\n" +
                lineMsg + "\n"
            );
        }
    }

    function PENALTY(my, team)
    {
        let random = Math.floor( Math.random() * team.Count )
        let count = 0;
        while( random === my - 1 || team.Member[random] === "" )
        {
            count++;
            if(count >= 1000)
            {
                return false;
            }
            random = Math.floor( Math.random() * team.Count )
        }
        return random;
    }

    function HANDLE_LIST_ALL(teamList)
    {
        let MSG = "";


        if(teamList.length == 0)
        {
            MSG = "\n" + lineMsg + "\n생성된 팀이 없습니다.\n" + lineMsg + "\n";
        }
        else
        {
            for (let i = 0; i < teamList.length; i++)
            {
                let count = 0;
                for (let x = 0; x < teamList[i].Count; x++)
                {
                    if(teamList[i].Member[x] !== "" && teamList[i].Member[x] !== undefined)
                        count++;
                }

                MSG += (i+1) + "팀. " + teamList[i].Title + " [" + teamList[i].Time + "] (" + count + "/" + teamList[i].Count + ")";

                if(count === teamList[i].Count)
                {
                    MSG += "⛔";
                }
                MSG += "\n";
            }
        }

        return MSG;
    }

    function HANDLE_LIST(obj)
    {
        let MSG = "\n" + obj.Title + "\n" + "[" + obj.Time + "]\n";
        for (let i = 0; i < obj.Count; i++)
        {
            if(obj.Member[i] === undefined)
                obj.Member[i] = "";

            if(i == 0)
            {
                MSG += "  " + (numberString[i]) + ". " + obj.Member[i] + " (초대/오더)\n";
            }
            else
            {
                MSG += "  " + (numberString[i]) + ". " + obj.Member[i] + "\n";
            }
        }

        if(obj.Buff !== undefined)
        {
            MSG += (lineMsg + "\n");
            obj.Buff.forEach( (v, k) => {
                if(v === null)
                    v = "";
                MSG += " (" + buff[k] + ") " + v + "\n";
            })
        }

        return MSG;
    }

    function FileSave(path, data)
    {
        return File.save(path, JSON.stringify(data));
    }

    function FileLoad(path)
    {
        return JSON.parse(File.read(path));
    }

    function TRANS_JOB(data)
    {
        let returnData = "";

        ["혀로", "히어로"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(히어로)";
            }
        });

        ["팔라", "팔라딘"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(팔라)";
            }
        });

        ["다크나이트", "다크", "다낰"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(다낰)";
            }
        });

        ["불독"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(불독)";
            }
        });

        ["썬콜"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(썬콜)";
            }
        });

        ["숍", "비숍"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(비숍)";
            }
        });

        ["보우마스터", "보마"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(보마)";
            }
        });

        ["신궁"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(신궁)";
            }
        });

        ["나로", "나이트로드"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(나로)";
            }
        });

        ["섀도어", "섀도", "새도"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(섀도)";
            }
        });

        ["밮", "바이퍼", "밥", "🍚"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(밮)";
            }
        });

        ["캡틴"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(캡틴)";
            }
        });

        ["캐논슈터", "캐슈"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(캐슈)";
            }
        });

        ["소울마스터", "소울", "소마"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(소마)";
            }
        });

        ["플위", "플레임", "플레임위자드"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(플위)";
            }
        });

        ["윈브", "윈드브레이커"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(윈브)";
            }
        });

        ["나워", "나이트워커"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(나워)";
            }
        });

        ["스커", "스트", "스트라이커"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(스뚜)";
            }
        });

        ["아란"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(아란)";
            }
        });

        ["메르세데스", "메세", "메새"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(메세)";
            }
        });

        ["에반"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(에반)";
            }
        });

        ["루미", "루미너스"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(루미)";
            }
        });

        ["은월"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(은월)";
            }
        });

        ["배매", "배메", "배틀메이지"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(배매)";
            }
        });

        ["와헌", "와일드헌터"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(와헌)";
            }
        });

        ["데슬", "데몬슬레이어"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(데슬)";
            }
        });

        ["데벤져", "데벤", "데몬어벤져"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(데벤)";
            }
        });

        ["카이저", "카이져"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(카이져)";
            }
        });

        ["엔젤", "엔버", "엔젤"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(엔버)";
            }
        });

        ["제논", "죄논"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(제논)";
            }
        });

        ["팬텀", "팬덤", "펜텀", "펜덤"].map( (v, k) => {
            if(data.indexOf(v) != -1)
            {
                returnData = "(팬텀)";
            }
        });

        return returnData;
    }

    function PRINT_MSG(msg)
    {
        //console.log(msg);
        replier.reply(msg);
    }
}