# Beautiful numbers
[CF55D]

注意到能代表 1-9 的最大公约数只有 50 个左右，把它们处理出来，并预处理转移关系，那么剩下的就是个直接的数位 DP 了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<iostream>
#include<algorithm>
#include<cassert>
using namespace std;

typedef long long ll;
#define pw(x) (1<<(x))
const int LCM=2520;

ll F[20][2550][50],G[20][2550][50];
int idcnt=0,Id[LCM+10],uId[LCM+10];
int len,Num[30];

ll lcm(ll a,ll b);
ll Calc(ll x);
ll dfs(int i,int b,int num,int lcmid);
int main(){
    memset(F,-1,sizeof(F));
    Id[1]=1;idcnt=1;Id[0]=0;
    for (int i=1;i<=LCM;i++)
        if (Id[i]){
            uId[Id[i]]=i;
            for (int j=2;j<=9;j++)
                if (lcm(i,j)<=LCM&&Id[lcm(i,j)]==0) Id[lcm(i,j)]=++idcnt;
        }
    int Case;cin>>Case;
    while (Case--){
        ll l,r;cin>>l>>r;
        cout<<Calc(r)-Calc(l-1)<<endl;
    }
    return 0;
}
ll lcm(ll a,ll b){
    if (!a||!b) return a+b;
    return a/__gcd(a,b)*b;
}
ll Calc(ll x){
    if (x==0) return 1;
    memset(G,-1,sizeof(G));
    len=0;while (x) Num[++len]=x%10,x/=10;
    ll ret=0;
    for (int i=0;i<=Num[len];i++) ret+=dfs(len-1,(i==Num[len]),i,Id[i]);
    return ret;
}
ll dfs(int i,int b,int num,int lcmid){
    if (i==0){
        if (lcmid==0||num%uId[lcmid]==0) return 1;
        return 0;
    }
    if (b==0&&F[i][num][lcmid]!=-1) return F[i][num][lcmid];
    if (b==1&&G[i][num][lcmid]!=-1) return G[i][num][lcmid];
    ll ret=0;
    for (int k=0,up=(b?Num[i]:9);k<=up;k++)
        ret+=dfs(i-1,!(b==0||k<Num[i]),(num*10+k)%LCM,Id[lcm(uId[lcmid],k)]);
    if (b==0) F[i][num][lcmid]=ret;
    else G[i][num][lcmid]=ret;
    return ret;
}
```