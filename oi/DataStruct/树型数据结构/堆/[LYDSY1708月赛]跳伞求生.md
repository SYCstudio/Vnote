# [LYDSY1708月赛]跳伞求生
[BZOJ4977]

小Q最近沉迷于《跳伞求生》游戏。他组建了一支由n名玩家（包括他自己）组成的战队，编号依次为1到n。这个游戏中，每局游戏开始时，所有玩家都会从飞机上跳伞，选择一个目的地降落，跳伞和降落的时间有早有晚。在某局游戏降落前，他们在空中观察发现地面上一共有m间房子，编号依次为1到m。其中每间房子恰好有一名敌人早于他们到达。小Q战队的第i名玩家拥有a_i发子弹，地面上第i间房子里的敌人拥有b_i发子弹，消灭他可以获得c_i点积分。每名玩家必须且只能选择一间房子降落，然后去消灭里面的敌人。若第i名玩家选择了第j间房子，如果a_i>b_j，那么他就可以消灭该敌人，获得a_i-b_j+c_j的团队奖励积分，否则他会被敌人消灭。为了防止团灭，小Q不允许多名玩家选择同一间房子，因此如果某位玩家毫无利用价值，你可以选择让他退出游戏。因为房子之间的距离过长，你可以认为每名玩家在降落之后不能再去消灭其它房间里的敌人。作为小Q战队的指挥，请制定一套最优的降落方案，使得最后获得的团队奖励总积分最大

容易得到一个网络流的模型，考虑用堆模拟这个过程。对于 Ai-Bj+Cj，如果 i 被另一个人替代的话更优，变动的贡献只有 -Ai ，所以将人和房间按照 Ai,Bi 排序，每次枚举人，加入小于其 Ai 的所有房间，如果能够获得收益则获得收益同时向堆中加入 -Ai 的反悔。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long

const int maxN=101000;

int n,m;
int A[maxN];
pair<int,int> P[maxN];
priority_queue<int> H;

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%d",&A[i]);
	for (int i=1;i<=m;i++){
		int b,c;scanf("%d%d",&b,&c);
		P[i].first=b;P[i].second=c-b;
	}
	sort(&A[1],&A[n+1]);sort(&P[1],&P[m+1]);
	ll Ans=0;
	for (int i=1,j=1;i<=n;i++){
		while (j<=m&&P[j].first<A[i]) H.push(P[j++].second);
		if (H.empty()||H.top()+A[i]<0) continue;
		Ans=Ans+H.top()+A[i];H.pop();H.push(-A[i]);
	}
	printf("%lld\n",Ans);return 0;
}
```