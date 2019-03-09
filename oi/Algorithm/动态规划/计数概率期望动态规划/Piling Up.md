# Piling Up
[AGC013D]

Joisino has a lot of red and blue bricks and a large box.  
She will build a tower of these bricks in the following manner.  
First, she will pick a total of $N$ bricks and put them into the box.
Here, there may be any number of bricks of each color in the box, as long as there are $N$ bricks in total.
Particularly, there may be zero red bricks or zero blue bricks.
Then, she will repeat an operation $M$ times, which consists of the following three steps:  
Take out an arbitrary brick from the box.  
Put one red brick and one blue brick into the box.  
Take out another arbitrary brick from the box.  
After the $M$ operations, Joisino will build a tower by stacking the $2 \times M$ bricks removed from the box, in the order they are taken out.
She is interested in the following question: how many different sequences of colors of these $2 \times M$ bricks are possible?
Write a program to find the answer.
Since it can be extremely large, print the count modulo $10^9+7$.  

注意到一次操作相当于是把一个红球换成蓝球、或者把蓝球换成红球、或者干脆什么都不换。但是要记录的方案数是最终序列的个数而不是操作的次数。先考虑设 F[i][j] 表示到第 i 轮时，当前还剩 j 个红球的塔的方案数。下面对四种情况进行讨论。  
00：要求 j 大于 0 ，转移到 j-1  
01：要求 j 大于 0 ，转移到 j  
10：要求 j 小于 n ，转移到 j  
11：要求 j 小于 n ，转移到 j+1 。

一个自然的想法就是加一维 0/1 表示是否已经下触碰到 0 ，但是这样会有问题，因为到 0 的时候不会有第 2 种转移，但实际上是应该存在这样的方案的。那么就在下触碰到 0 的时候统计第一种，在下触碰到 1 的时候统计第二种。

```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxN=3010;
const int Mod=1e9+7;

int n,m;
int F[maxN][maxN][2];

void Plus(int &x,int y);
int main(){
    scanf("%d%d",&n,&m);
    F[0][0][1]=1;
    for (int i=1;i<=n;i++) F[0][i][0]=1;
    for (int i=0;i<m;i++) for (int j=0;j<=n;j++) for (int k=0;k<=1;k++){
        if (!F[i][j][k]) continue;
        if (j>=1) Plus(F[i+1][j-1][k|(j==1)],F[i][j][k]),Plus(F[i+1][j][k|(j==1)],F[i][j][k]);
        if (j<n) Plus(F[i+1][j][k],F[i][j][k]),Plus(F[i+1][j+1][k],F[i][j][k]);
    }
    int Ans=0;
    for (int i=0;i<=n;i++) Plus(Ans,F[m][i][1]);
    printf("%d\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```