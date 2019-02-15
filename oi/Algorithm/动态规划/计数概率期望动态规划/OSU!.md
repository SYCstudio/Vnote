# OSU!
[BZOJ4318 Luogu1654]

osu 是一款群众喜闻乐见的休闲软件。  
我们可以把osu的规则简化与改编成以下的样子:  
一共有n次操作，每次操作只有成功与失败之分，成功对应1，失败对应0，n次操作对应为1个长度为n的01串。在这个串中连续的 X个1可以贡献X^3 的分数，这x个1不能被其他连续的1所包含（也就是极长的一串1，具体见样例解释）  
现在给出n，以及每个操作的成功率，请你输出期望分数，输出四舍五入后保留1位小数。

自己开始的想法是把 DP 转移式列出来，发现要维护四个变量表示四个的和，这样做理论上没有问题，但是中间一个三次方的求和项会远远超过 double 能表示的范围，所以不行。  
标算的做法则是直接考虑 x,x^2,x^3 的期望，利用期望的线性性转移。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define ld long double
#define f128 __float128
#define p2(x) ((x)*(x))
#define p3(x) ((x)*(x)*(x))

const int maxN=1010000;

int n;
//ld P[maxN];
//f128 F[maxN],G[maxN];
ld f1[maxN],f2[maxN],Ans[maxN];

int main(){
    scanf("%d",&n);
    for (int i=1;i<=n;i++){
	ld p;scanf("%LF",&p);
	f1[i]=(f1[i-1]+1)*p;
	f2[i]=(f2[i-1]+2*f1[i-1]+1)*p;
	Ans[i]=Ans[i-1]+(3*f1[i-1]+3*f2[i-1]+1)*p;
    }
    /*
    for (int i=1;i<=n;i++) scanf("%LF",&P[i]);
    f128 f=0,g0=1,g1=0,g2=0,g3=0;
    for (int i=1;i<=n+1;i++){
	f128 np=1-P[i];
	F[i]=np*(f+p3(i-1)*g0-p2(i-1)*3*g1+(i-1)*3.0*g2-g3);
	G[i]=np*g0;
	f=f*P[i]+F[i];
	g0=g0*P[i]+G[i];
	g1=g1*P[i]+G[i]*i;
	g2=g2*P[i]+G[i]*p2(i);
	g3=g3*P[i]+G[i]*p3(i);
	//cout<<i<<" "<<f<<" "<<g0<<" "<<g1<<" "<<g2<<" "<<g3<<endl;
    }
    //*/
    /*
    G[0]=1;
    for (int i=1;i<=n+1;i++){
	ld p=1-P[i];
	for (int j=i-1;j>=0;j--){
	    F[i]=F[i]+F[j]*p+sss(i-j-1)*G[j]*p;
	    G[i]=G[i]+G[j]*p;
	    p=p*P[j];
	}
    }
    //*/
    printf("%.1LF\n",Ans[n]);return 0;
}
```