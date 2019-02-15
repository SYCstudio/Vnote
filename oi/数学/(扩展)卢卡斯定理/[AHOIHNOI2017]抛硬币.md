# [AHOIHNOI2017]抛硬币
[BZOJ4830 Luogu3726]

小 A 和小 B 是一对好朋友，他们经常一起愉快的玩耍。最近小 B 沉迷于**师手游，天天刷本，根本无心搞学习。但是已经入坑了几个月，却一次都没有抽到 SSR，让他非常怀疑人生。勤勉的小 A 为了劝说小 B 早日脱坑，认真学习，决定以抛硬币的形式让小 B 明白他是一个彻彻底底的非洲人，从而对这个游戏绝望。两个人同时抛 b 次硬币，如果小 A 的正面朝上的次数大于小 B 正面朝上的次数，则小 A 获胜。  
但事实上，小 A 也曾经沉迷过拉拉游戏，而且他一次 UR 也没有抽到过，所以他对于自己的运气也没有太大把握。所以他决定在小 B 没注意的时候作弊，悄悄地多抛几次硬币，当然，为了不让小 B 怀疑，他不会抛太多次。现在小 A 想问你，在多少种可能的情况下，他能够胜过小 B 呢？由于答案可能太大，所以你只需要输出答案在十进制表示下的最后 k 位即可。

首先讨论 a=b 的情况，有 $2^{a+b}$为总情况，除了平局的情况外，A 赢与 B 赢的情况互相对应，又有平局的答案为 $Q-\sum _ {i=1}^a \binom{a}{i}\binom{a}{i}=\binom{2a}{a}$，所以最后的答案就是 $\frac{2^{a+b}-Q}{2}$ 。  
然后考虑 $a>b$ 的情况，考虑所有 A 能赢的情况，把所有的正反面倒过来，得到的可能是 B 赢，也可能仍是 A 赢，考虑不管反不反过来均是 A 赢的情况，设为 Q 种，那么有最后的答案就为 $\frac{2^{a+b}+Q}{2}$。考虑如何求 $Q$ ，设 A 正面次数为 ai， B 正面次数为 bi ，则对应的情况满足 ai>bi 且 a-ai>b-bi ，即 a-b>ai-bi ，那么有 $\sum _ {i=0}^b \binom{b}{i} \sum _ {j=i+1}^{a-b+i-1}\binom{a}{j}=\sum_{i=0}^b\binom{b}{i}\sum _ {j=1}^{a-b-1}\binom{a}{i+j}$，换一下顺序得到 $\sum _ {j=1} ^ {a-b-1} \sum _ {i=0} ^ b \binom{b-i}{b} \binom{a}{i+j}=\sum _ {j=1} ^ {a-b-1} \binom{a+b}{b+j}$ ，枚举 j 然后扩展卢卡斯求组合数。  
求组合数的时候注意一个细节，因为下面要除以 2 ，对于 $2^{a+b}$ 很好处理，直接对指数 -1 ；对于组合数，如果是模 $5^9$ 的时候也很好处理，直接乘以 2 关于它的逆元；但是对于 2 不能直接处理，有可能组合数本身就是一个奇数，此时无法除二；处理办法是，观察到这个累加式是对称的，所以只需要枚举一半累计。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<map>
using namespace std;

#define ll long long

const int Mod2=512;
const int Mod5=1953125;
const int MM=1e9;

int Num[Mod5];
int P[2]={2,5},PM[2]={Mod2,Mod5};
int Fac[2][Mod5+10],Fc[2][Mod5+10];
int fcnt=0;
map<ll,int> Mp[2];

int QPow(int x,ll cnt,int Mod);
int GetInv(int x,int p);
void Exgcd(int a,int b,int &x,int &y);
int Calc(ll n,ll m,bool div2);
int C(ll n,ll m,int pid,bool div2);
int GetFac(ll n,int pid);

int main(){
	Num[1]=1;for (int i=2;i<Mod2;i++) Num[i]=(i%2)?(i):(Num[i/2]);
	Fac[0][0]=Fc[0][0]=1;
	for (int i=1;i<Mod2;i++) Fac[0][i]=1ll*Fac[0][i-1]*((i%2)?i:1)%Mod2,Fc[0][i]=1ll*Fc[0][i-1]*Num[i]%Mod2;
	Num[1]=1;for (int i=2;i<Mod5;i++) Num[i]=(i%5)?(i):(Num[i/5]);
	Fac[1][0]=Fc[1][0]=1;
	for (int i=1;i<Mod5;i++) Fac[1][i]=1ll*Fac[1][i-1]*((i%5)?i:1)%Mod5,Fc[1][i]=1ll*Fc[1][i-1]*Num[i]%Mod5;

	ll a,b,K;
	while (scanf("%lld%lld%lld",&a,&b,&K)!=EOF){
		ll Ans=0;
		if (a==b) Ans=(QPow(2,a+b-1,MM)-Calc(a+b,a,1)%MM+MM)%MM;
		else{
			Ans=QPow(2,a+b-1,MM);
			if ((a-b-1)&1) Ans=(Ans+Calc(a+b,(a+b)/2,1)%MM+MM)%MM;
			for (ll i=b+1;i<=(a+b-1)/2;i++) Ans=(Ans+Calc(a+b,i,0)%MM+MM)%MM;
		}
		Ans%=MM;
		char buf[10];sprintf(buf,"%%0%lldlld\n",K);
		printf(buf,Ans);
	}
	return 0;
}

int QPow(int x,ll cnt,int Mod){
	if (x==0) return 0;
	if (x==1) return 1;
	int ret=1;x%=Mod;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

int GetInv(int x,int p){
	int e,f;
	Exgcd(x,p,e,f);
	e=(e%p+p)%p;
	return e;
}

void Exgcd(int a,int b,int &x,int &y){
	if (b==0){
		x=1;y=0;return;
	}
	Exgcd(b,a%b,x,y);
	int t=x;x=y;y=t-a/b*y;return;
}

const ll k2=109,k5=1537323,inv=976563;

int Calc(ll n,ll m,bool div2){
	if (n<m) return 0;
	int a2=C(n,m,0,div2)%MM,a5=C(n,m,1,div2)%MM;
	a2=1ll*a2*Mod5%MM*k2%MM;
	a5=1ll*a5*Mod2%MM*k5%MM;
	return (a2+a5)%MM;
}

int C(ll n,ll m,int pid,bool div2){
	int a=GetFac(n,pid),b=GetInv(GetFac(n-m,pid),PM[pid]),c=GetInv(GetFac(m,pid),PM[pid]);
	int cnt=0;
	for (ll i=n;i;i/=P[pid]) cnt+=i/P[pid];
	for (ll i=m;i;i/=P[pid]) cnt-=i/P[pid];
	for (ll i=n-m;i;i/=P[pid]) cnt-=i/P[pid];
	if ((div2)&&(pid==0)) --cnt;
	int ret=1ll*a*b%PM[pid]*c%PM[pid]*QPow(P[pid],cnt,PM[pid])%PM[pid];
	if ((div2)&&(pid==1)) ret=ret*inv%PM[pid];
	return ret;
}

int GetFac(ll n,int pid){
	++fcnt;
	if (n<PM[pid]) return Fc[pid][n];
	if (Mp[pid].count(n)) return Mp[pid][n];
	int ret=1;
	ret=QPow(Fac[pid][PM[pid]-1],n/PM[pid],PM[pid]);
	ret=1ll*ret*Fac[pid][n%PM[pid]]%PM[pid];
	return Mp[pid][n]=1ll*ret*GetFac(n/P[pid],pid)%PM[pid];
}
```