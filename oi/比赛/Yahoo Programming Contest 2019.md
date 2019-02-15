# Yahoo Programming Contest 2019

[link](https://atcoder.jp/contests/yahoo-procon2019-qual)

## A.Anti-Adjacency

Determine if we can choose K different integers between 1 and N (inclusive) so that no two of them differ by 1.  
判断是否能在 [1..n] 中选出 K 个不同的数使得两两之差不是 1 。

使得两两之差为 2 即可。

```cpp
#include<bits/stdc++.h>
using namespace std;

int main(){
    int n,K;scanf("%d%d",&n,&K);
    if (n%2==0) --n;
    n=n/2+1;
    (n>=K)?puts("YES"):puts("NO");
    return 0;
}
```

## B.Path

There are four towns, numbered 1,2,3 and 4. Also, there are three roads. The i-th road connects different towns ai and bi  
bidirectionally. No two roads connect the same pair of towns. Other than these roads, there is no way to travel between these towns, but any town can be reached from any other town using these roads.  
Determine if we can visit all the towns by traversing each of the roads exactly once.  
有一张四个点三条边的简单无向图，判断是否存在一条欧拉路。

累计每一个点的度数，当且仅当度数为1,1,2,2时存在欧拉路。

```cpp
#include<bits/stdc++.h>
using namespace std;

int D[5];

int main(){
    for (int i=1;i<=6;i++){
        int x;scanf("%d",&x);++D[x];
    }
    sort(&D[1],&D[5]);
    if (D[1]==1&&D[2]==1&&D[3]==2&&D[4]==2) puts("YES");
    else puts("NO");return 0;
}
```

## C.When I hit my pocket...

Snuke has one biscuit and zero Japanese yen (the currency) in his pocket. He will perform the following operations exactly K times in total, in the order he likes:  
    Hit his pocket, which magically increases the number of biscuits by one.  
    Exchange A biscuits to 1 yen.  
    Exchange 1 yen to B biscuits.  
Find the maximum possible number of biscuits in Snuke's pocket after K operations.    
开始时手上有 1 块饼干，0 元钱。每次操作可以选择增加一块饼干、将 A 块饼干变成 1 元钱、将 1 元钱变成 B 块饼干。现在进行 K 次操作，使得最终饼干数量最多。

分类讨论一下。显然只有两种决策，要么一直只每次生成一块饼干，要么通过两次操作把 A 块饼干变成 B 块饼干。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define ll long long

int main(){
    ll K,A,B;scanf("%lld%lld%lld",&K,&A,&B);
    ll Ans=K+1;
    if (K>=A+1){
        ll base=B;K=K-A-1;
        ll cnt=K/2;base=base+cnt*(B-A);
        if (K%2==1) base++;
        Ans=max(Ans,base);
    }
    printf("%lld\n",Ans);
    return 0;
}
```

## D.Ears

Snuke stands on a number line. He has $L$ ears, and he will walk along the line continuously under the following conditions:  
He never visits a point with coordinate less than $0$, or a point with coordinate greater than $L$.  
He starts walking at a point with integer coordinate, and also finishes walking at a point with integer coordinate.  
He only changes direction at a point with integer coordinate.  
Each time when Snuke passes a point with coordinate $i-0.5$, where $i$ is an integer, he put a stone in his $i$-th ear.  
After Snuke finishes walking, Ringo will repeat the following operations in some order so that, for each $i$, Snuke's $i$-th ear contains $A_i$ stones:  
Put a stone in one of Snuke's ears.  
Remove a stone from one of Snuke's ears.  
Find the minimum number of operations required when Ringo can freely decide how Snuke walks.  
一条蛇在数轴 [0..L] 的整点上来回走，每经过 i-0.5 这个点就会在整点 i 上放置一个石子。现在有另一个人，在蛇走完的基础上继续放石子或者删除石子。现在给出最终石子的序列，求人最少需要进行多少次操作。

首先考虑简单的情况，假设蛇是从 l 出发最后走到 r 在此期间一直向右，那么答案就是中间是偶数的数个数以及两边的和。然后考虑蛇在左起点的时候可以先向左边移动再向右边，同理在右终点的时候先继续向右再向左，这部分折返的代价是 (x<=2?2-x:x&1)，那么设 F[i] 表示左边的答案， G[i] 表示右边的答案，预处理 F[i] 和 G[i] ，均是区间和的形式，转化为前缀和相减发现可以用一个变量维护。再枚举右端点组合答案。

```cpp
#include<bits/stdc++.h>
using namespace std;

#define ll long long
const int maxN=202000;
const ll INF=1e18;

int n;
ll Sum[maxN],F[maxN],G[maxN],Even[maxN],Cost[maxN];

int main(){
    scanf("%d",&n);
    for (int i=1;i<=n;i++){
        ll x;scanf("%lld",&x);Sum[i]=Sum[i-1]+x;
        Even[i]=Even[i-1]+(~x&1);Cost[i]=Cost[i-1]+(x<=2?2-x:(x&1));
    }
    ll mn=0;
    for (int i=1;i<=n;i++) mn=min(mn,-Cost[i]+Sum[i]),F[i]=mn+Cost[i];
    mn=Cost[n];
    for (int i=n-1;i>=0;i--) mn=min(mn,Sum[n]+Cost[i]-Sum[i]),G[i]=mn-Cost[i];

    ll Ans=INF;mn=INF;
    for (int i=0;i<=n;i++) mn=min(mn,F[i]-Even[i]),Ans=min(Ans,mn+Even[i]+G[i]);
    printf("%lld\n",Ans);return 0;
}
```

## E.Odd Subrectangles
There is a square grid with $N$ rows and $M$ columns.
Each square contains an integer: $0$ or $1$. The square at the $i$-th row from the top and the $j$-th column from the left contains $a_{ij}$.  
Among the $2^{N+M}$ possible pairs of a subset $A$ of the rows and a subset $B$ of the columns, find the number of the pairs that satisfy the following condition, modulo $998244353$:  
The sum of the $|A||B|$ numbers contained in the intersection of the rows belonging to $A$ and the columns belonging to $B$, is odd.
给出 $n \times m$ 的 0/1 矩阵，现在要求选出一些行和列，使得它们交的和为奇数。求方案数。

要求交的和为基数，不妨看做是异或和为 1 。把矩阵看做 n 个 m 位的 0/1 向量，先高斯消元得到自由元的数量 c，$(2^n-2^c)$ 即为至少有一个 1 的行的组合， $2^{m-1}$ 为其中选出奇数个 1 的方案数，答案就是 $(2^n-2^c)2^{m-1}$

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=310;
const int Mod=998244353;

int n,m;
bitset<maxN> B[maxN];
int C[maxN][maxN],Sm[maxN],pw[maxN];

int main(){
    pw[0]=1;for (int i=1;i<maxN;i++) pw[i]=2ll*pw[i-1]%Mod;
    scanf("%d%d",&n,&m);
    int cnt=0,one=0;
    for (int i=1;i<=n;i++){
        bitset<maxN> I;I.reset();
        for (int j=1;j<=m;j++){
            int x;scanf("%d",&x);I[j]=x;
        }
        bool flag=0;
        for (int j=1;j<=m;j++)
            if (I[j]){
                if (B[j]==0){
                    B[j]=I;flag=1;break;
                }
                else I^=B[j];
            }
        if (flag==0) ++cnt;
    }

    printf("%lld\n",1ll*(pw[n]-pw[cnt]+Mod)%Mod*pw[m-1]%Mod);return 0;
}
```

## F.Pass

There are N Snukes lining up in a row. You are given a string S of length N. The i-th Snuke from the front has two red balls if the i-th character in S is 0; one red ball and one blue ball if the i-th character in S is 1; two blue balls if the i-th character in S is 2.  
Takahashi has a sequence that is initially empty. Find the number of the possible sequences he may have after repeating the following procedure 2N times, modulo 998244353  
Each Snuke who has one or more balls simultaneously chooses one of his balls and hand it to the Snuke in front of him, or hand it to Takahashi if he is the first Snuke in the row.  
Takahashi receives the ball and put it to the end of his sequence.  
有 n 条蛇，每条蛇有两个红球、两个蓝球或者各有一个。现在进行 2N 次操作，每次操作中，还有球的蛇选择一个自己的球传给前面一个，第一条蛇把选择的球排成一个序列。求最后不同的序列的个数。

注意到随着时间增加，能够选择的红球数量和蓝球数量是固定的。那么设 F[i][j] 表示前 i 轮中选择了 j 个蓝球的方案，讨论这一轮是放蓝球还是红球转移。

```cpp
#include<bits/stdc++.h>
using namespace std;

const int maxN=4010;
const int Mod=998244353;

char Input[maxN];
int n;
int Sum[maxN][2];
int F[maxN][maxN];

void Plus(int &x,int y);

int main(){
    scanf("%s",Input+1);n=strlen(Input+1);
    for (int i=1;i<=n;i++){
        Sum[i][0]=Sum[i-1][0];Sum[i][1]=Sum[i-1][1];
        if (Input[i]=='0') Sum[i][0]+=2;
        if (Input[i]=='1') Sum[i][0]++,Sum[i][1]++;
        if (Input[i]=='2') Sum[i][1]+=2;
    }
    for (int i=n+1;i<=n+n;i++) Sum[i][0]=Sum[i-1][0],Sum[i][1]=Sum[i-1][1];
    F[0][0]=1;
    for (int i=0;i<n+n;i++)
        for (int j=0;j<=min(i,Sum[i][0]);j++){
            if (Sum[i+1][0]>j) Plus(F[i+1][j+1],F[i][j]);
            if (Sum[i+1][1]>i-j) Plus(F[i+1][j],F[i][j]);
        }
    int Ans=0;
    for (int i=0;i<=n+n;i++) Plus(Ans,F[n+n][i]);
    printf("%d\n",Ans);return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
```