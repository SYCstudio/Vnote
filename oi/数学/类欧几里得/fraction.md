# fraction
[BZOJ2187]

分数 给你4个正整数a，b，c，d，求一个最简分数 p / q满足 a / b < p / q < c / d，若有多组解，输出q最小的一组，若仍有多组解，输出p最小的一组。 

分几种情况讨论一下。

首先讨论边界情况。当 a=0 时，有 $\frac{p}{q} < \frac{c}{d}$ 即 $q > \frac{pd}{c}$ ，由于要求 q 最小，所以此时 p 取 1 ，q 取 $\frac{p}{c}$ 向上取整；当 $\frac{a}{b} \frac{c}{d}$ 之间存在一个整数时， $\frac{p}{q}$ 即取其中的那个整数，因为此时 $p$ 为 1 。  
然后考虑需要转化的情况。当 $a \ge b$ 时，可以将左边下取整变成 $\frac{a'}{b}+k$ ，然后中间和右边都同时减去 k ，变成求子问题 $(\frac{a'}{b},\frac{p}{q}-k,\frac{c}{d}-k)$ ；另一种情况时是 $a<b$ ，此时原式等价于 $\frac{b}{a} > \frac{q}{p} > \frac{d}{c}$ 。  
注意到变形的时候很类似欧几里得中的辗转相除，所以复杂度为 $log$

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int inf=2147483647;

void Calc(ll a,ll b,ll c,ll d,ll &p,ll &q);

int main(){
	ll a,b,c,d,p,q;
	while (scanf("%lld%lld%lld%lld",&a,&b,&c,&d)!=EOF){
		Calc(a,b,c,d,p,q);
		printf("%lld/%lld\n",p,q);
	}
	return 0;
}

void Calc(ll a,ll b,ll c,ll d,ll &p,ll &q){
	if ((ll)(a/b)+1<=((ll)(c+d-1)/d)-1) p=(ll)(a/b)+1,q=1;
	else if (a==0) p=1,q=d/c+1;
	else if ((a<=b)&&(c<=d)) Calc(d,c,b,a,q,p);
	else Calc(a%b,b,c-(ll)(a/b)*d,d,p,q),p+=(ll)(a/b)*q;
}
```