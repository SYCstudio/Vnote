# [THUSC2015]异或运算
[BZOJ4103]

给定长度为n的数列X={x1,x2,...,xn}和长度为m的数列Y={y1,y2,...,ym}，令矩阵A中第i行第j列的值Aij=xi xor  yj，每次询问给定矩形区域i∈[u,d],j∈[l,r]，找出第k大的Aij。

注意到 n 比较小而 m 比较大。对 m 这一维建立 Trie 树。每次查询的时候，每一层扫描 n 这一维的元素，看能否放 1 。类似一个二分的过程。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

class Trie{
    public:
    int ch[2],cnt;
};

const int maxN=1010;
const int maxM=303000;

int n,m,nodecnt;
int X[maxM],rt[maxM],rl[maxM],rr[maxM];
Trie T[maxM*40];

void Insert(int &x,int b,int key);
int Query(int b,int K,int l,int r);

int main(){
    scanf("%d%d",&n,&m);for (int i=1;i<=n;i++) scanf("%d",&X[i]);
    for (int i=1;i<=m;i++){
        int key;scanf("%d",&key);rt[i]=rt[i-1];Insert(rt[i],30,key);
    }
    int Q;scanf("%d",&Q);
    while (Q--){
        int a,b,c,d,K;scanf("%d%d%d%d%d",&a,&b,&c,&d,&K);K=(b-a+1)*(d-c+1)-K+1;
        for (int i=a;i<=b;i++) rl[i]=rt[c-1],rr[i]=rt[d];
        printf("%d\n",Query(30,K,a,b));
    }
    return 0;
}
void Insert(int &x,int b,int key){
    T[++nodecnt]=T[x];x=nodecnt;T[x].cnt++;
    if (b==-1) return;
    Insert(T[x].ch[(key>>b)&1],b-1,key);
    return;
}
int Query(int b,int K,int l,int r){
    if (b==-1) return 0;
    int sum=0;
    for (int i=l;i<=r;i++){
        int d=(X[i]>>b)&1;
        sum+=T[T[rr[i]].ch[d]].cnt-T[T[rl[i]].ch[d]].cnt;
    }
    if (sum>=K){
        for (int i=l;i<=r;i++){
            int d=(X[i]>>b)&1;
            rr[i]=T[rr[i]].ch[d];
            rl[i]=T[rl[i]].ch[d];
        }
        return Query(b-1,K,l,r);
    }
    else{
        K-=sum;
        for (int i=l;i<=r;i++){
            int d=(X[i]>>b)&1;
            rr[i]=T[rr[i]].ch[d^1];
            rl[i]=T[rl[i]].ch[d^1];
        }
        return Query(b-1,K,l,r)|(1<<b);
    }
}
```