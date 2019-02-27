# Ksenia and Combinatorics
[CF382E]

有一棵𝑛个节点的树，标号从1到𝑛。  
除了1号节点至多与另外2个节点连边，其余至多与另外3个节点连边。  
两个树是相同的，当且仅每个节点的相连节点都相同。  
求有多少种不同的这样的树，满足最大匹配为$k$，答案对$1e9+7$取模

设 F[i][j][0/1] 表示 i 个点，匹配数为 j ，根节点是否匹配的方案数。由于是二叉树，所以很好转移。枚举左右子树大小，组合数分配编号。  
注意当左右子树大小一样时，要防止左右子树交换算重，需要强制最小的标号在左边，组合数要变一变。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=57;
const int Mod=1000000007;

int n,K,C[maxN][maxN];
int F[maxN][maxN][2];

void Plus(int &x,int y);

int main(){
    scanf("%d%d",&n,&K);
    F[1][0][0]=1;F[0][0][1]=1;
    for (int i=0;i<=n;i++) for (int j=C[i][0]=1;j<=i;j++) C[i][j]=(C[i-1][j]+C[i-1][j-1])%Mod;
    for (int i=2;i<=n;i++)
        for (int j=0;j<=K;j++){
            for (int sz=i-1;sz>=i-1-sz;sz--)
                for (int mt=0;mt<=j;mt++){
                    if (mt*2>sz||(j-mt)*2>i-1-sz) continue;
                    int c=1ll*((sz==i-1-sz)?C[i-2][sz-1]:C[i-1][sz])*((i==n)?1:i)%Mod;
                    Plus(F[i][j][0],1ll*F[sz][mt][1]*F[i-sz-1][j-mt][1]%Mod*c%Mod);
                }
            for (int sz=i-1;sz>=i-1-sz;sz--)
                for (int mt=0;mt<j;mt++){
                    if (mt*2>sz||(j-mt-1)*2>i-sz-1) continue;
                    int c=1ll*((sz==i-1-sz)?C[i-2][sz-1]:C[i-1][sz])*((i==n)?1:i)%Mod;
                    Plus(F[i][j][1],1ll*F[sz][mt][0]*F[i-sz-1][j-mt-1][0]%Mod*c%Mod);
                    Plus(F[i][j][1],1ll*F[sz][mt][1]*F[i-sz-1][j-mt-1][0]%Mod*c%Mod);
                    Plus(F[i][j][1],1ll*F[sz][mt][0]*F[i-sz-1][j-mt-1][1]%Mod*c%Mod);
                }
            }
    printf("%d\n",(F[n][K][0]+F[n][K][1])%Mod);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```