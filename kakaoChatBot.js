/*
 * 제작: YT헤움 (유튜브채널: https://youtube.com/c/헤움)
 * 배포: 비상업적 이용으로 무제한 배포 및 소스 수정 가능 합니다.
 */

// 운영진 목록 (예시: '운영진1', '운영진2', '운영진3')
const Admin = [];

// 목록의 구분선
const lineMsg = "======================="

// 목록의 머릿말
const headerMsg = "각 팀 리더는 시간조율\n딜표,방생성,인원초대";

// 목록의 꼬릿말
const footerMsg = "무통보 지각,결석 시 \n벌금 1억메소, \n벌금은 팀리더에게 주세요.";

// 팀목록 최대인원
const maxCount = 10;

// 채팅방이름
const chatRoomName = "봇테스트"

// 수정X
let teamList = [];

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId)
{
    if(room == chatRoomName)
    {
        if (sender == "메린이")
        {
            replier.reply(sender + "님 메린이라는 닉네임 보다는 게임닉네임 또는 다른 닉네임으로 변경 부탁드립니다.");
        }

        if (msg == "/봇상태")
        {
            replier.reply("배터리잔량: " + Device.getBatteryLevel() + "%");
        }

        if (msg == "/길드가입조건")
        {
            replier.reply("1. 레벨 121이상\n2. 성인(남자는 군필)\n3. 길드단톡 이용 가능자\n");
        }

        if (msg == "/도움말")
        {
            replier.reply(
                "\n::사용가능 명령어::\n" +
                "/봇상태\n" +
                "/팀생성\n (예시: /팀생성 10명 카여제-저녁8시)\n\n" +
                "/팀참가\n (예시: /팀참가 1팀 1번 리더)\n\n" +
                "/팀목록\n" +
                "/길드가입조건\n" +
                "/도움말\n"
            );
        }

        if (msg == "/팀목록")
        {
            printTeamList();
        }

        if ( msg.indexOf("/팀생성") != -1 )
        {
            let tmpMsg = msg.split(' ');
            let tmpName = tmpMsg[2];
            let count = Number(tmpMsg[1].replace('명', ''));

            if(count <= maxCount && tmpName != undefined)
            {
                teamList.push({name: tmpName, member: new Array(count)})
                printTeamList();
            }
        }

        if( msg.indexOf("/팀참가") != -1)
        {
            let tmpMsg = msg.split(' ');
            let teamNumber = Number(tmpMsg[1].replace('팀', ''));
            let memberNumber = Number(tmpMsg[2].replace('번', ''));
            let nickName = tmpMsg[3];

            if(teamNumber != undefined && memberNumber != undefined && nickName != undefined && teamList[teamNumber-1].member.length >= memberNumber)
            {
                teamList[teamNumber-1].member[memberNumber-1] = nickName;
                printTeamList();
            }
        }

        if( msg.indexOf("/팀삭제") != -1)
        {
            let tmpMsg = msg.split(' ');
            let teamNumber = Number(tmpMsg[1].replace('팀', ''));

            tmpTeamList = [];
            for(let i=0; i < teamList.length; i++)
            {
                if(i + 1 != teamNumber)
                {
                    tmpTeamList.push(teamList[i])
                }
            }
            teamList = [];
            teamList = tmpTeamList;
            printTeamList();
        }
    }

    function printTeamList()
    {
        let content = lineMsg+"\n" + headerMsg+"\n" + lineMsg+"\n";


        for(let i=0; i < teamList.length; i++)
        {
            content += '\n' + (i+1) + '팀 ' + teamList[i].name + '\n';
            for(let j=0; j < teamList[i].member.length; j++)
            {
                if(teamList[i].member[j] == undefined)
                {
                    teamList[i].member[j] = ""
                }

                content += "　　" + (j+1) + ". " + teamList[i].member[j] + '\n';
            }
        }
        content += lineMsg+"\n" + footerMsg+"\n" + lineMsg+"\n";
        replier.reply(content);
    }
}