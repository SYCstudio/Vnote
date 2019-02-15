# [USACO08NOV]玩具Toys[BJWC2018]餐巾计划问题
[BZOJ1229 Luogu2917 Luogu4480]

Bessie's birthday is coming up, and she wishes to celebrate for the next D (1 <= D <= 100,000; 70% of testdata has 1 <= D <= 500) days. Cows have short attention spans so Bessie wants to provide toys to entertain them. She has calculated that she will require T_i (1 <= T_i <= 50) toys on day i.  
Bessie's kindergarten provides many services to its aspiring bovine programmers, including a toy shop which sells toys for Tc (1 <= Tc <= 60) dollars. Bessie wishes to save money by reusing toys, but Farmer John is worried about transmitting diseases and requires toys to be disinfected before use. (The toy shop disinfects the toys when it sells them.)  
The two disinfectant services near the farm provide handy complete services. The first one charges C1 dollars and requires N1 nights to complete; the second charges C2 dollars and requires N2 nights to complete (1 <= N1 <= D; 1 <= N2 <= D; 1 <= C1 <= 60; 1 <= C2 <= 60). Bessie takes the toys to the disinfecters after the party and can pay and pick them back up the next morning if one night service is rendered, or on later mornings if more nights are required for disinfecting.  
Being an educated cow, Bessie has already learned the value of saving her money. Help her find the cheapest way she can provide toys for her party. 
POINTS: 400  
Bessie的生日快到了，她希望用D（1<=D<=100000）天来庆祝。奶牛们的注意力不会太集中，因此Bessie想通过提供玩具的方式来使它们高兴。她已经计算出了第i天需要的玩具数Ti（1<=Ti<=50）.  
Bessie的幼儿园给它们的奶牛程序员们提供了许多服务，包括一个每天以Tc(1<=Tc<=60)美元卖出商品的玩具店。Bessie想尽可能地节省钱。但是Farmer John担心没有经过消毒的玩具会带来传染病。（玩具店卖出的玩具是经过消毒）  
有两种消毒的方式。第1种方式需要收费C1美元，需要N1个晚上的时间；第2种方式需要收费C2美元，需要N2个晚上的时间（1<=N1,N2<=D；1<=C1,C2<=60）。Bessie在派对结束之后把她的玩具带去消毒。如果消毒只需要一天，那么第二天就可以拿到；如果还需要一天，那么第三天才可以拿到。  
作为一个受过教育的奶牛，Bessie已经了解到节约的意义。帮助她找到提供玩具的最便宜的方法。

当天数 D 较小的时候，有费用流建模的解法。当 D 大的时候，需要考虑更简单的解法。  
假设 n1<n2 ，当 c1<c2 时发现无论如何都不会采用时间更长的方式，所以可以直接另 c2=c1 ，那么下面就都是基于 n1<n2 ,c1>=c2 的了。  
首先，需要买的玩具可以看作是第一天就买好。其次，消毒可以看作是瞬间完成的，只是说必须至少是 n1 天以前的，且若为 n2 填以前的，价格为 c2 。假设确定第一天要买 nt 个玩具，从前往后贪心地考虑，如果当前还有新买的玩具没有用，先用新买的。然后再考虑用 n2 天以前的，能用则用。然后再考虑用 n1 天以前的，注意因为要贪心地使得 n2 尽量多，所以这里选 n1 的时候尽量选天数靠后的，这样能使后面的 n2 更多。这两个贪心可以用一个双端队列来支持操作。如果发现某一次无法达成，则说明这个 nt 不合法。  
那么现在的做法是枚举一开始买多少个玩具。可以证明，花费关于玩具个数是一个下凸函数，那么三分第一天买玩具的个数，取得极值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=201000;
const int inf=2147483647;

int n,Nd[maxN],Res[maxN];
int n1,n2,c1,c2,cst;
deque<int> Q;

int Calc(int num);

int main(){
	//freopen("in.in","r",stdin);
	scanf("%d%d%d%d%d%d",&n,&n1,&n2,&c1,&c2,&cst);
	int sum=0;
	for (int i=1;i<=n;i++) scanf("%d",&Nd[i]),sum=sum+Nd[i];

	if (n1>n2) swap(n1,n2),swap(c1,c2);
	if (c1<c2) c2=c1;
	
	int L=0,R=sum;
	do{
		int sz=(R-L+1)/3;
		int md1=L+sz-1,md2=R-sz+1;
		if (Calc(md1)>=Calc(md2)) L=md1;
		else R=md2;
	}
	while (L+50<=R);
	
	int Ans=inf;
	for (int i=L;i<=R;i++) Ans=min(Ans,Calc(i));
	printf("%d\n",Ans);return 0;
}

int Calc(int num){
	Q.clear();
	int ret=0,key=num;
	for (int i=1;i<=n;i++){
		Res[i]=Nd[i];
		if (i-n1>=1) Q.push_back(i-n1);
		if (Nd[i]<=num) num-=Nd[i],ret+=Nd[i]*cst;
		else{
			int nd=Nd[i]-num;ret+=num*cst;num=0;
			while (nd){
				if (Q.empty()) return inf;
				if (Q.front()<=i-n2){
					int id=Q.front();Q.pop_front();
					int mn=min(nd,Res[id]);ret+=mn*c2;
					nd-=mn;Res[id]-=mn;
					if (Res[id]) Q.push_front(id);
				}
				else{
					int id=Q.back();Q.pop_back();
					int mn=min(nd,Res[id]);ret+=mn*c1;
					nd-=mn;Res[id]-=mn;
					if (Res[id]) Q.push_back(id);
				}
			}
		}
	}
	return ret;
}

```