# [UNR #1]争夺圣杯
[UOJ213]

小C与 Saber 签订契约之后达成了共同争夺圣杯的目标，然而他们赢得圣杯的道路并没有这么轻易，小C需要与其他的英灵进行决战。  
小C通过一些交易得知，其他的英灵已经结盟了。大决战那天，其他的英灵站成了一排，从左到右依次编号为 $1$ 到 $n$，血量依次为 $\mathrm{HP}_1, \dots, \mathrm{HP}_n$。  
小C还知道，这些英灵暗自商量了一个整数 $m$ （$1 \leq m \leq n$）。Saber 和这些英灵之间的战斗将会持续 $n - m + 1$ 轮，其中第 $i$ 轮 Saber 将与编号为 $i, i + 1, \dots, i + m - 1$ 的英灵进行战斗，所需要耗费的魔力值为这些战斗的英灵中的血量的最大值。而由于人多力量大等因素，每轮战斗后英灵的血量不会有任何变化。  
所有战斗结束后，Saber 耗费的总魔力值为每轮战斗耗费的魔力值之和。  
小C和 Saber 必须挺过这 $n - m + 1$ 轮，之后这些英灵将一而再，再而三，三而竭，闻风丧胆，望风而逃，三十六计走为上。小C很焦虑，于是就来向您求救。小C想要知道所有可能的 $m = 1， 2， \dots, n$ 中，Saber 需要耗费的总魔力值分别是多少。

按照权值从大到小处理每一个英雄。每个英雄对答案的贡献是三个一次函数，分别差分，最后累加得到答案。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<iostream>
using namespace std;

#define pw(x) (1<<(x))
typedef long long ll;
const int maxN=1010000;
const int maxB=20;
const int Mod=998244353;

int n,Seq[maxN],Lg[maxN];
int ST[maxB][maxN];
ll Sk[maxN],Sb[maxN];

bool cmp(int a,int b);
int GetMx(int l,int r);
void Divide(int l,int r);
int main(){
    for (int i=2;i<maxN;i++) Lg[i]=Lg[i>>1]+1;
    scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);
    for (int i=1;i<=n;i++) ST[0][i]=i;
    for (int i=1;i<maxB;i++) for (int j=1;j+pw(i)-1<=n;j++) ST[i][j]=max(ST[i-1][j],ST[i-1][j+pw(i-1)],cmp);
    Divide(1,n);
    for (int i=1;i<=n;i++) Sk[i]=(Sk[i]+Sk[i-1])%Mod,Sb[i]=(Sb[i]+Sb[i-1])%Mod;
    int Ans=0;
    for (int i=1;i<=n;i++) Ans=Ans^((1ll*i*Sk[i]%Mod+Sb[i])%Mod);
    printf("%d\n",Ans);return 0;
}
bool cmp(int a,int b){
    return Seq[a]<Seq[b];
}
int GetMx(int l,int r){
    int lg=Lg[r-l+1];return max(ST[lg][l],ST[lg][r-pw(lg)+1],cmp);
}
void Divide(int l,int r){
    if (l==r){
        Sb[1]=(Sb[1]+Seq[l]%Mod)%Mod;Sb[2]=(Sb[2]-Seq[l]%Mod+Mod)%Mod;
        return;
    }
    ll p=GetMx(l,r),mx=max(p-l+1,r-p+1),mn=min(p-l+1,r-p+1),sz=r-l+1;
    ll k=Mod-Seq[p]%Mod,b=(Seq[p]%Mod-1ll*sz*k%Mod+Mod)%Mod;
    Sk[mx]=(Sk[mx]+k)%Mod;Sk[sz+1]=(Sk[sz+1]-k+Mod)%Mod;
    Sb[mx]=(Sb[mx]+b)%Mod;Sb[sz+1]=(Sb[sz+1]-b+Mod)%Mod;
    b=1ll*Seq[p]%Mod*mn%Mod;
    Sb[mn]=(Sb[mn]+b)%Mod;Sb[mx]=(Sb[mx]-b+Mod)%Mod;
    k=Seq[p]%Mod;
    Sk[1]=(Sk[1]+k)%Mod;Sk[mn]=(Sk[mn]-k+Mod)%Mod;
    if (l<p) Divide(l,p-1);if (p<r) Divide(p+1,r);
    return;
}
```