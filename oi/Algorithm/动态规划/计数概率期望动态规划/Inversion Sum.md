# Inversion Sum
[AGC030D]

You are given an integer sequence of length $N$: $A_1,A_2,...,A_N$. Let us perform $Q$ operations in order.
The $i$-th operation is described by two integers $X_i$ and $Y_i$. In this operation, we will choose one of the following two actions and perform it:  
Swap the values of $A_{X_i}$ and $A_{Y_i}$  
Do nothing  
There are $2^Q$ ways to perform these operations. Find the sum of the inversion numbers of the final sequences for all of these ways to perform operations, modulo $10^9+7$.  
Here, the inversion number of a sequence $P_1,P_2,...,P_M$ is the number of pairs of integers $(i,j)$ such that $1\leq i &lt; j\leq M$ and $P_i &gt; P_j$.

设 F[i][a][b] 表示到第 i 次，a<b 的概率，不难发现每次会修改的部分只有 O(n) 个，只修改这部分的 DP 值。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=3010;
const int Mod=1e9+7;
const int inv2=500000004;

int n,Q,Seq[maxN];
int F[maxN][maxN],G[maxN][maxN];

void Plus(int &x,int y);
int main(){
    scanf("%d%d",&n,&Q);
    for (int i=1;i<=n;i++) scanf("%d",&Seq[i]);
    for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) F[i][j]=Seq[i]<Seq[j];
    for (int qi=1;qi<=Q;qi++){
        int x,y;scanf("%d%d",&x,&y);
        if (x==y) continue;
        for (int i=1;i<=n;i++) if (i!=y&&i!=x){
            Plus(G[i][x],1ll*F[i][x]*inv2%Mod);Plus(G[i][y],1ll*F[i][x]*inv2%Mod);
            Plus(G[x][i],1ll*F[x][i]*inv2%Mod);Plus(G[y][i],1ll*F[x][i]*inv2%Mod);
        }
        for (int i=1;i<=n;i++) if (i!=x&&i!=y){
            Plus(G[i][y],1ll*F[i][y]*inv2%Mod);Plus(G[i][x],1ll*F[i][y]*inv2%Mod);
            Plus(G[y][i],1ll*F[y][i]*inv2%Mod);Plus(G[x][i],1ll*F[y][i]*inv2%Mod);
        }
        G[y][x]=G[x][y]=1ll*(F[x][y]+F[y][x])%Mod*inv2%Mod;
        for (int i=1;i<=n;i++) F[x][i]=G[x][i],F[i][x]=G[i][x],F[y][i]=G[y][i],F[i][y]=G[i][y];
        for (int i=1;i<=n;i++) G[x][i]=G[i][x]=G[y][i]=G[i][y]=0;
    }
    int Ans=0;
    for (int i=1;i<=n;i++) for (int j=1;j<i;j++) Plus(Ans,F[i][j]);
    for (int i=1;i<=Q;i++) Ans=2ll*Ans%Mod;
    printf("%d\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```