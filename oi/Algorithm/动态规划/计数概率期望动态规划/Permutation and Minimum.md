# Permutation and Minimum
[AGC030F]

There is a sequence of length $2N$: $A_1, A_2, ..., A_{2N}$.
Each $A_i$ is either $-1$ or an integer between $1$ and $2N$ (inclusive). Any integer other than $-1$ appears at most once in ${A_i}$.  
For each $i$ such that $A_i = -1$, Snuke replaces $A_i$ with an integer between $1$ and $2N$ (inclusive), so that ${A_i}$ will be a permutation of $1, 2, ..., 2N$.
Then, he finds a sequence of length $N$, $B_1, B_2, ..., B_N$, as $B_i = min(A_{2i-1}, A_{2i})$.  
Find the number of different sequences that $B_1, B_2, ..., B_N$ can be, modulo $10^9 + 7$

已经匹配好了的可以直接拿出来。考虑两个都是空的组和已经填了一个的组。设 F[i][j][k] 表示从大到小做到第 i 个数，当前有 j 组是原来空的组现在填了一个， k 表示有多少个已经填了一个的组。对于那些在两个都出现的组中的数直接跳过，否则对于出现在空一个的组中的数，可以转移到 k+1 表示新增一个，也可以转移到 j-1 表示拆掉一个和它匹配；对于没有出现过的数，要么新开一个未匹配的组，要么匹配一个匹配了一半的组。

```cpp
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=310;
const int Mod=1e9+7;

int n,Seq[maxN+maxN];
int use[maxN+maxN],one[maxN+maxN];
int F[2][maxN][maxN];

void Plus(int &x,int y);
int main(){
    int ecnt=0,ocnt=0;
    scanf("%d",&n);for (int i=1;i<=n+n;i++) scanf("%d",&Seq[i]);
    for (int i=1;i<=n+n;i+=2)
        if (Seq[i]==-1&&Seq[i+1]==-1) ++ecnt;
        else if (Seq[i]==-1||Seq[i+1]==-1) one[Seq[i]+Seq[i+1]+1]=1,++ocnt;
        else use[Seq[i]]=use[Seq[i+1]]=1;
    int now=1;F[now][0][0]=1;
    for (int i=n+n;i>=1;i--)
        if (!use[i]){
            now^=1;memset(F[now],0,sizeof(F[now]));
            for (int j=0;j<=ecnt+ocnt;j++)
                for (int k=0;k<=ocnt;k++)
                    if (F[now^1][j][k]){
                        int key=F[now^1][j][k];
                        if (one[i]){
                            if (j) Plus(F[now][j-1][k],key);
                            Plus(F[now][j][k+1],key);
                        }
                        else{
                            Plus(F[now][j+1][k],key);
                            if (j) Plus(F[now][j-1][k],key);
                            if (k) Plus(F[now][j][k-1],1ll*k*key%Mod);
                        }
                    }
        }
    int Ans=F[now][0][0];for (int i=1;i<=ecnt;i++) Ans=1ll*Ans*i%Mod;
    printf("%d\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```