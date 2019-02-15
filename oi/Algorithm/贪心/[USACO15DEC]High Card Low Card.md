# [USACO15DEC]High Card Low Card
[BZOJ4391 Luogu3129]

Bessie the cow is a hu e fan of card games, which is quite surprising, given her lack of opposable thumbs. Unfortunately, none of the other cows in the herd are good opponents. They are so bad, in fact, that they always play in a completely predictable fashion! Nonetheless, it can still be a challenge for Bessie to figure out how to win.  
Bessie and her friend Elsie are currently playing a simple card game where they take a deck of 2N2N2N cards, conveniently numbered 1…2N1 \ldots 2N1…2N, and divide them into NNN cards for Bessie and NNN cards for Elsie. The two then play NNN rounds, where in each round Bessie and Elsie both play a single card. Initially, the player who plays the highest card earns a point. However, at one point during the game, Bessie can decide to switch the rules so that for the rest of the game, the player who plays the lowest card wins a point. Bessie can choose not to use this option, leaving the entire game in "high card wins" mode, or she can even invoke the option right away, making the entire game follow the "low card wins" rule.  
Given that Bessie can predict the order in which Elsie will play her cards, please determine the maximum number of points Bessie can win.  
贝西很喜欢玩一种纸牌游戏。  
贝西和她的朋友艾尔西正在玩这个简单的纸牌游戏。游戏有2N张牌，牌上的数字是1到2N。把这些牌分成两份，贝西有N张，艾尔西有另外N张。接下来她们进行N轮出牌，每次各出一张牌。一开始，谁出的牌上的数字大，谁就获得这一轮的胜利。贝西有一个特殊权利，她可以在任意一个时刻把原本数字大的获胜的规则改成数字小的获胜，这个改变将会一直持续到游戏结束。特别的，贝西可以从第一轮开始就使用小牌获胜的规则，也可以直到最后一轮都还杂使用大牌获胜的规则。  
现在，贝西已经知道了艾尔西出牌的顺序，她想知道她最多能够赢多少轮。

正着做一遍贪心，倒着做一遍贪心，然后枚举断点组合答案。  
这里不需要考虑某一张牌可能被两边分别使用的原因是，若有一张牌被使用了两次，那可以用那张没有被用的取替换其中之一。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<set>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50500<<1;
const int inf=2147483647;

int n;
int Seq[maxN];
bool Exi[maxN];
int F[maxN],G[maxN];
set<int> S;

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Seq[i]),Exi[Seq[i]]=1;
	for (int i=1;i<=n+n;i++) if (Exi[i]==0) S.insert(i);
	for (int i=1;i<=n;i++)
		if (S.upper_bound(Seq[i])!=S.end()){
			S.erase(S.upper_bound(Seq[i]));F[i]=F[i-1]+1;
		}
		else F[i]=F[i-1];
	S.clear();
	for (int i=1;i<=n+n;i++) if (Exi[i]==0) S.insert(-i);
	for (int i=n;i>=1;i--)
		if (S.lower_bound(-Seq[i])!=S.end()){
			S.erase(S.lower_bound(-Seq[i]));G[i]=G[i+1]+1;
		}
		else G[i]=G[i+1];
	int Ans=0;
	for (int i=0;i<=n;i++) Ans=max(Ans,F[i]+G[i+1]);
	printf("%d\n",Ans);return 0;
}
```