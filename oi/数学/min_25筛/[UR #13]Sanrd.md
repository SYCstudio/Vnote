# [UR #13]Sanrd
[UOJ188]

这里是跳蚤国中央广播电台，现在为您转播的是著名人类智慧大师 picks 博士与人工智能 betacome 之间的最后一轮赛事。  
这一场交锋的规则由网友 st****ll 提供，这位网友也将获得由不想跳的跳蚤不是好跳蚤——最强跳蚤跳跳跳公司提供的金牌跳蚤一只。  
就在刚才，第二轮比赛也已经结束了，picks 博士不负众望为人类扳回了一城。特别是在刚才劣势的时候，picks 博士突然地停止了对盘子的操作，让 betacome 乱了阵脚，并最后实现了反超，这一手操作也被网友戏称为“神之一手”。  
“恩，这一手表明了 betacome 也是存在弱点而不是不可战胜的，picks 博士可能也在一直尝试着不同的比赛风格，试图找到 betacome 的漏洞。上一场的胜利说明了 betacome 在对于突发事件的应对方式可能存在着缺陷，在这一轮 picks 博士应该会针对这一点进行比赛，我认为他的胜率应该会非常大。”  
那看来 A 先生抱着非常乐观的心态啊，现在最后一轮的比赛已经开始了，同样，接下来由 A 先生来给我们介绍一下这一轮比赛的规则。  
“好，大家现在看屏幕，在这一轮游戏中，给出了一个如下所示的将 $n$ 分解质因子的算法。”  
检查$n$是否是质数，假如$n$是质数或$n=1$则直接结束。  
定义一个变量$p$，初始值为2。  
检查$p$是否是$n$的因子，假如$p$是$n$的因子，不断将$n$除去$p$，直到$p$不再是$n$的质因子。  
检查$n$是否是质数，假如$n$是质数或$n = 1$，就结束这个算法，否则将$p$的值加一，返回第三步。  
“为了检验人类智慧和人工智能之间的计算能力的差距，主办方希望选手对区间 $[l,r]$ 中的所有数都用这个算法进行分解。为了检验计算的正确性，选手需要计算分解完每一个数后，$p$ 的和。特殊地，如果分解在第一步就结束了，那么就认为 $p=0$。”  
恩，谢谢 A 先生。大家可以看到这一道是数论方面的题目，刚才 A 先生也私下和我说了，这一道题目的难度要比前两轮的难度高很多，他认为在短时间内，比赛双方都无法得到准确的结果。因为我们节目组决定与观众们进行互动，正在收看节目的观众可以关注节目跳蚤信公众号参与解题，最快得到正确答案的观众将会获得由不想跳的跳蚤不是好跳蚤——最强跳蚤跳跳跳公司提供的精美礼品一份。  
作为一名光荣的吃土少年，你立志要把这份礼品收入囊中以告别悲惨的吃土生活。然而，全世界的观众中也不乏人类智慧大师的存在，为了从他们中脱颖而出，你需要以最快的速度得到这一个问题的答案。

可以发现，需要求的就是 $\sum f(i),f(i)=i 的次大质因子$ ，这个本不是个积性函数，考虑 min25 筛求解的过程，预处理 $g(n)$ 表示 $1 \sim n$ 中质数的个数，那么在 min25 筛搜索枚举的过程中，每次枚举的就是最小的质因子，那么在内层中作为最小的质因子在下一层中就成了次小，所以用一个 pair 来存储内层递归的答案和内层最小质因子个数。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=705000;
const int inf=2147483647;

ll n,srt;
bool notprime[maxN];
int pcnt,P[maxN];
ll num,Num[maxN+maxN],Id[maxN+maxN];
ll G[maxN+maxN];

void Init();
ll Calc(ll x);
int GetId(ll x);
pair<ll,ll> S(ll x,int p);

int main(){
	Init();ll L,R;scanf("%lld%lld",&L,&R);
	printf("%lld\n",Calc(R)-Calc(L-1));
	return 0;
}

void Init(){
	notprime[1]=1;
	for (int i=2;i<maxN;i++){
		if (notprime[i]==0) P[++pcnt]=i;
		for (int j=1;(j<=pcnt)&&(1ll*i*P[j]<maxN);j++){
			notprime[i*P[j]]=1;if (i%P[j]==0) break;
		}
	}
	return;
}

ll Calc(ll x){
	num=0;n=x;srt=sqrt(x);
	for (ll i=1,j;i<=n;i=j+1){
		j=x/i;Num[++num]=j;G[num]=j-1;
		if (j<=srt) Id[j]=num;
		else Id[i+maxN]=num;j=n/j;
	}
	for (int j=1;j<=pcnt;j++)
		for (int i=1;(i<=num)&&(1ll*P[j]*P[j]<=Num[i]);i++)
			G[i]=G[i]-G[GetId(Num[i]/P[j])]+j-1;
	return S(x,1).second;
}

int GetId(ll x){
	if (x<=srt) return Id[x];
	return Id[n/x+maxN];
}

pair<ll,ll> S(ll x,int p){
	if ((x<=1)||(x<P[p])) return make_pair(0,0);
	ll r1=G[GetId(x)]-(p-1),r2=0;
	for (int i=p;(i<=pcnt)&&(1ll*P[i]*P[i]<=x);i++){
		ll mul=P[i];
		for (int j=1;1ll*mul*P[i]<=x;j++,mul=mul*P[i]){
			pair<ll,ll> R=S(x/mul,i+1);
			r2=r2+R.first*P[i]+R.second+P[i];
		}
	}
	return make_pair(r1,r2);
}
```