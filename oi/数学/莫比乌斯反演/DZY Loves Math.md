# DZY Loves Math
[BZOJ3309]

对于正整数n，定义f(n)为n所含质因子的最大幂指数。例如f(1960)=f(2^3 * 5^1 * 7^2)=3, f(10007)=1, f(1)=0。
给定正整数a,b，求sigma(sigma(f(gcd(i,j)))) (i=1..a, j=1..b)。

莫比乌斯反演后不难得到

$$\sum _ {T=1} ^ n \lfloor \frac{n}{T} \rfloor \lfloor \frac{m}{T} \rfloor \sum _ {i|T} \mu(i) f(\frac{T}{i})$$

考虑后面这个东西怎么求。设 T 唯一分解为 $T=\prod _ {i=1} ^ k p _ i ^ {a _ i}$，首先考虑要求 $\mu$ 要有值，那么仅有 $2 ^ k$ 有效贡献。考虑若存在一组 $a _ i < a _ j$，那么所有的贡献都会被 mu 两两抵消；否则，最后只会剩下 $f(\prod p _ i)$ 的贡献，注意到这个恰好就是 $(-1) ^ {k+1}$ 。预处理线性筛出来。接下来的就是前缀和然后数论分块了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

typedef long long ll;
const int maxNum=10000010;

int pcnt,P[maxNum],notp[maxNum],G[maxNum],Lw[maxNum],Lc[maxNum];
ll Sum[maxNum];

void Init();
int main(){
    Init();
    int Case;scanf("%d",&Case);
    while (Case--){
        int n,m;scanf("%d%d",&n,&m);if (n>m) swap(n,m);
        ll Ans=0;
        for (int l=1,r;l<=n;l=r+1){
            r=min(n/(n/l),m/(m/l));
            Ans=Ans+(Sum[r]-Sum[l-1])*(n/l)*(m/l);
        }
        printf("%lld\n",Ans);
    }
    return 0;
}
void Init(){
    G[1]=0;notp[1]=1;
    for (int i=2;i<maxNum;i++){
        if (notp[i]==0) P[++pcnt]=i,Lw[i]=i,Lc[i]=1,G[i]=1;
        for (int j=1;j<=pcnt&&1ll*i*P[j]<maxNum;j++){
            notp[i*P[j]]=1;
            if (i%P[j]==0){
                Lw[i*P[j]]=Lw[i]*P[j];Lc[i*P[j]]=Lc[i]+1;
                if (Lw[i]==i) G[i*P[j]]=1;
                else if (Lc[i/Lw[i]]==Lc[i*P[j]]) G[i*P[j]]=-G[i/Lw[i]];
                break;
            }
            Lc[i*P[j]]=1;Lw[i*P[j]]=P[j];
            if (Lc[i]==1) G[i*P[j]]=-G[i];
        }
    }
    for (int i=1;i<maxNum;i++) Sum[i]=Sum[i-1]+G[i];
    return;
}
```